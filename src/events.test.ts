import test from 'ava'

import { encode } from './encode'
import { adminFactory } from './factory'
import {
	ClubsConfiguration,
	ClubsEventsDetailUpdatePluginOptions,
	ClubsPluginCategory,
	ClubsPluginOption,
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
			name: 'home',
			options: [],
			enable: true,
		},
		{
			name: 'buy',
			options: [],
			enable: true,
		},
		{
			name: 'nft',
			options: [],
			enable: false,
		},
		{
			name: 'community',
			options: [{ key: 'guild', value: 'https://www.testguild.com' }],
			enable: true,
		},
		{
			name: 'contact',
			options: [{ key: 'requiredDev', value: 100 }],
			enable: true,
		},
		{
			name: 'membership',
			options: [{ key: 'count', value: 10 }],
			enable: true,
		},
	],
	chainId: 0,
	rpcUrl: '',
}

const pluginsMap = {
	home: {
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{ paths: ['home'], component: null, props: { name, propertyAddress } },
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['home'],
				component: null,
				props: { options },
			},
		],
		meta: { displayName: 'Home', category: ClubsPluginCategory.Uncategorized },
	},
	buy: {
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{ paths: ['buy'], component: null, props: { name, propertyAddress } },
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['buy'],
				component: null,
				props: { options },
			},
		],
		meta: { displayName: 'Buy', category: ClubsPluginCategory.Uncategorized },
	},
	community: {
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{
				paths: ['community'],
				component: null,
				props: { name, propertyAddress },
			},
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['community'],
				component: null,
				props: { options },
			},
		],
		meta: {
			displayName: 'Community',
			category: ClubsPluginCategory.Uncategorized,
		},
	},
	nft: {
		getPagePaths: async (
			_: any,
			{
				name,
				propertyAddress,
			}: { readonly name: string; readonly propertyAddress: string }
		) => [
			{ paths: ['nft'], component: null, props: { name, propertyAddress } },
		],
		getAdminPaths: async (options: readonly ClubsPluginOption[]) => [
			{
				paths: ['nft'],
				component: null,
				props: { options },
			},
		],
		meta: { displayName: 'NFT', category: ClubsPluginCategory.Uncategorized },
	},
}

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
		plugins: {
			...pluginsMap,
		},
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
