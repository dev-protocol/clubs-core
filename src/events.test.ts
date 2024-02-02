import test from 'ava'
import type { AstroComponentFactory } from 'astro/dist/runtime/server'

import { encode } from './encode'
import { adminFactory } from './factory'
import {
	type ClubsConfiguration,
	type ClubsEventsDetailUpdatePluginOptions,
	ClubsPluginCategory,
	type ClubsPluginOption,
} from './types'
import { updatePluginOptionsEventListener } from './fixtures/utils'

const singleOptionPluginConfig: ClubsConfiguration = {
	name: '',
	twitterHandle: '',
	description: '',
	url: '',
	propertyAddress: '',
	adminRolePoints: 0,
	plugins: [
		{
			id: 'home',
			options: [],
			enable: true,
		},
		{
			id: 'buy',
			options: [],
			enable: true,
		},
		{
			id: 'nft',
			options: [],
			enable: false,
		},
		{
			id: 'community',
			options: [{ key: 'guild', value: 'https://www.testguild.com' }],
			enable: true,
		},
		{
			id: 'contact',
			options: [{ key: 'requiredDev', value: 100 }],
			enable: true,
		},
		{
			id: 'membership',
			options: [{ key: 'count', value: 10 }],
			enable: true,
		},
	],
	chainId: 0,
	rpcUrl: '',
}

const pluginsMap = [
	{
		getPagePaths: async () => [],
		getAdminPaths: async () => [],
		getLayout: async () => ({
			layout: null as unknown as AstroComponentFactory,
		}),
		meta: {
			id: 'theme',
			displayName: 'Home',
			category: ClubsPluginCategory.Theme,
		},
	},
	{
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{
				paths: ['home'],
				component: null as unknown as AstroComponentFactory,
				props: { name, propertyAddress },
			},
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['home'],
				component: null as unknown as AstroComponentFactory,
				props: { options },
			},
		],
		meta: {
			id: 'home',
			displayName: 'Home',
			category: ClubsPluginCategory.Uncategorized,
		},
	},
	{
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{
				paths: ['buy'],
				component: null as unknown as AstroComponentFactory,
				props: { name, propertyAddress },
			},
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['buy'],
				component: null as unknown as AstroComponentFactory,
				props: { options },
			},
		],
		meta: {
			id: 'buy',
			displayName: 'Buy',
			category: ClubsPluginCategory.Uncategorized,
		},
	},
	{
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{
				paths: ['community'],
				component: null as unknown as AstroComponentFactory,
				props: { name, propertyAddress },
			},
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['community'],
				component: null as unknown as AstroComponentFactory,
				props: { options },
			},
		],
		meta: {
			id: 'community',
			displayName: 'Community',
			category: ClubsPluginCategory.Uncategorized,
		},
	},
	{
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{
				paths: ['nft'],
				component: null as unknown as AstroComponentFactory,
				props: { name, propertyAddress },
			},
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['nft'],
				component: null as unknown as AstroComponentFactory,
				props: { options },
			},
		],
		meta: {
			id: 'nft',
			displayName: 'NFT',
			category: ClubsPluginCategory.Uncategorized,
		},
	},
]

test('should update the config correctly', async (t) => {
	// Make sure that old config is up to date as per test.
	const communityPluginGuildOption =
		singleOptionPluginConfig.plugins[3].options[0]
	t.is(communityPluginGuildOption.value, 'https://www.testguild.com')

	// Encode the configuration.
	const encodedConfig = encode(singleOptionPluginConfig)
	// Get the static path info.
	const { getStaticPaths } = adminFactory({
		config: () => encodedConfig,
		plugins: [...pluginsMap],
	})
	// Fetch the path details.
	const pathDetails: any = (await getStaticPaths()).find(
		(i: any) => i.params.page === 'community'
	)

	// Assert that pluginIndex is equal to that in the config.
	t.is(pathDetails.props.clubs.currentPluginIndex, 3)

	// Create a new artificial update.
	const updateDetails: ClubsEventsDetailUpdatePluginOptions = {
		data: [{ key: 'guild', value: 'https://www.newTestGuild.com' }],
		pluginIndex: pathDetails.props.clubs.currentPluginIndex || 0,
	}

	// Call the event listener that performs updates and returns the new config.
	const newConfig = await updatePluginOptionsEventListener(
		updateDetails,
		singleOptionPluginConfig
	)

	// The new config should not match the old config.
	t.notDeepEqual(singleOptionPluginConfig, newConfig)

	// The new config update should be reflected here.
	const newCommunityPluginGuildOption = newConfig.plugins[3].options[0]
	t.is(newCommunityPluginGuildOption.value, 'https://www.newTestGuild.com')
})
