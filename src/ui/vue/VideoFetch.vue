<script setup>
import MP4Box from 'mp4box'
import { onMounted, useTemplateRef, computed } from 'vue'

const props = defineProps({
	isControlled: {
		type: Boolean,
		default: true,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	posterUrl: {
		default: '',
		type: String,
	},
	videoClass: {
		default: '',
		type: String,
	},
})

// Refs and variables
const videoElement = useTemplateRef(`videoElement`)
let mediaSource = null
let sourceBuffers = {}
let mp4boxfile = null
let pendingSegments = {}

// Configure chunk size (1MB). Adjust if needed.
const CHUNK_SIZE = 1_000_000
let nextRangeStart = 0
let totalFileSize = 0
let isDownloading = false

onMounted(() => {
	if (!props.url) return

	mediaSource = new MediaSource()
	videoElement.value.src = URL.createObjectURL(mediaSource)
	mediaSource.addEventListener('sourceopen', onSourceOpen)

	setupMp4Box()
	startDownload()
})

const showSVG = computed(() => {
	if (videoElement.value) {
		return props.isControlled && (videoElement.value?.paused ?? true)
	}

	return props.isControlled
})

function onSourceOpen() {
	// MediaSource is ready to accept SourceBuffers
	// console.log('MediaSource opened') // Uncomment for debugging
}

function setupMp4Box() {
	mp4boxfile = MP4Box.createFile()

	// Fired when MP4Box starts parsing the "moov" box (movie metadata)
	mp4boxfile.onMoovStart = function () {
		// console.log('Parsing movie information...')
	}

	// Fired when MP4Box has the "moov" box and all track info ready
	mp4boxfile.onReady = function (info) {
		// Instead of manually setting mediaSource.duration, rely on segment-based approach
		initializeTracksAndBuffers(info)
		const initSegs = mp4boxfile.initializeSegmentation()

		// Create and append initial SourceBuffers based on track information
		initSegs.forEach((seg) => {
			const trackInfo = info.tracks.find((t) => t.id === seg.id)
			const codec = seg.codec || trackInfo?.codec
			if (!codec) {
				console.error(`Codec undefined for track ID: ${seg.id}`)
				return
			}

			const mime = `video/mp4; codecs="${codec}"`
			if (MediaSource.isTypeSupported(mime)) {
				const sb = mediaSource.addSourceBuffer(mime)
				sourceBuffers[seg.id] = sb

				// Handle subsequent segment appending after one finishes
				sb.addEventListener('updateend', () => onUpdateEnd(seg.id))

				// Append the initialization segment
				sb.appendBuffer(seg.buffer)
				// console.log(`SourceBuffer added with mime: ${mime}`)
			} else {
				console.error(`Unsupported MIME type: ${mime}`)
			}
		})

		// Start MP4Box file processing
		mp4boxfile.start()

		if (!props.isControlled) {
			// If controlled, then it will play when clicked.
			togglePlay()
		}
	}

	// Fired when a media segment is ready
	mp4boxfile.onSegment = function (trackId, user, buffer, sampleNum, is_last) {
		// If the corresponding SourceBuffer is ready, append immediately
		// Otherwise, queue it up in pendingSegments
		if (sourceBuffers[trackId] && !sourceBuffers[trackId].updating) {
			sourceBuffers[trackId].appendBuffer(buffer)
		} else {
			pendingSegments[trackId]?.push(buffer)
		}
	}
}

function initializeTracksAndBuffers(info) {
	info.tracks.forEach((track) => {
		// Define segmentation options: smaller durations lead to more frequent, smaller segments.
		mp4boxfile.setSegmentOptions(track.id, { duration: 2 })
		pendingSegments[track.id] = [] // Initialize each track's queue
	})
}

function onUpdateEnd(trackId) {
	// After finishing appending to a SourceBuffer,
	// check if there are pending segments and append the next one if available.
	if (
		pendingSegments[trackId]?.length > 0 &&
		!sourceBuffers[trackId].updating
	) {
		const nextBuffer = pendingSegments[trackId].shift()
		sourceBuffers[trackId].appendBuffer(nextBuffer)
	}

	// Check if the entire stream can now be ended.
	maybeEndOfStream()
}

async function startDownload() {
	isDownloading = true
	try {
		totalFileSize = await fetchFileSize()
		downloadChunk()
	} catch (err) {
		console.error('Could not fetch file size:', err)
	}
}

function fetchFileSize() {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest()
		xhr.open('HEAD', props.url, true)
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				const length = parseInt(
					xhr.getResponseHeader('Content-Length') || '0',
					10
				)
				resolve(length)
			} else {
				reject(new Error(`HEAD request failed with status ${xhr.status}`))
			}
		}
		xhr.onerror = () => reject(new Error('Network error during HEAD request'))
		xhr.send()
	})
}

function downloadChunk() {
	if (!isDownloading) return

	// If we've downloaded the entire file, flush MP4Box and possibly end the stream
	if (nextRangeStart >= totalFileSize) {
		mp4boxfile.flush()
		maybeEndOfStream()
		// Start playback after all data is processed
		videoElement.value?.play().catch((e) => console.error('Play error:', e))
		return
	}

	const end = Math.min(nextRangeStart + CHUNK_SIZE - 1, totalFileSize - 1)
	const xhr = new XMLHttpRequest()
	xhr.open('GET', props.url, true)
	xhr.responseType = 'arraybuffer'
	xhr.setRequestHeader('Range', `bytes=${nextRangeStart}-${end}`)

	xhr.onload = function () {
		if (xhr.status >= 200 && xhr.status < 300) {
			const buffer = xhr.response
			// MP4Box requires `fileStart` to know where this chunk fits in the file
			buffer.fileStart = nextRangeStart
			nextRangeStart = end + 1

			const next = mp4boxfile.appendBuffer(buffer)
			if (next) {
				// Giving some delay before requesting the next chunk can help throttle bandwidth
				setTimeout(downloadChunk, 100)
			}
		} else {
			console.error('Error downloading chunk. Status:', xhr.status)
		}
	}

	xhr.onerror = function (e) {
		console.error('XHR error during chunk download:', e)
	}
	xhr.send()
}

function maybeEndOfStream() {
	// Check if all data is downloaded
	if (nextRangeStart >= totalFileSize) {
		// Verify no pending segments and no buffers updating
		const noPending = Object.values(pendingSegments).every(
			(arr) => arr.length === 0
		)
		const noUpdating = Object.values(sourceBuffers).every((sb) => !sb.updating)

		if (noPending && noUpdating && mediaSource.readyState === 'open') {
			// All segments have been appended successfully
			mediaSource.endOfStream()
		}
	}
}

function togglePlay() {
	if (videoElement.value?.paused) {
		videoElement.value?.play().catch((e) => console.error('Play error:', e))
	} else {
		videoElement.value?.pause().catch((e) => console.error('Play error:', e))
	}
}
</script>

<template>
	<div class="relative m-0 h-full w-full cursor-pointer p-0">
		<video
			ref="videoElement"
			controlsList="nodownload"
			:autoplay="!isControlled"
			muted
			loop
			:poster="posterUrl"
			:class="videoClass"
		>
			<track kind="captions" />
		</video>
		<div
			v-if="showSVG"
			class="absolute inset-0 m-auto flex size-1/2 items-center justify-center text-white opacity-60"
			@click.stop.prevent="togglePlay"
		>
			<svg
				className="w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>
</template>
