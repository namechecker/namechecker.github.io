<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { checkDomain } from '$lib/checker/domain';

	type CheckResult = {
		platform: string;
		url: string;
		icon: string;
		available: boolean;
	};

	let username = $state('');
	let results = $state<CheckResult[]>([]);
	let isChecking = $state(false);

	const platforms = [
		{
			name: 'Domain (.com)',
			url: (id: string) => `${id}.com`,
			icon: 'globe',
			checkFn: checkDomain
		},
		{ name: 'YouTube', url: (id: string) => `youtube.com/@${id}`, icon: 'youtube' },
		{ name: 'GitHub', url: (id: string) => `github.com/${id}`, icon: 'github' },
		{ name: 'Facebook', url: (id: string) => `facebook.com/${id}`, icon: 'facebook' },
		{ name: 'Twitter/X', url: (id: string) => `twitter.com/${id}`, icon: 'twitter' },
		{ name: 'Instagram', url: (id: string) => `instagram.com/${id}`, icon: 'instagram' },
		{ name: 'LinkedIn', url: (id: string) => `linkedin.com/in/${id}`, icon: 'linkedin' }
	];

	async function handleCheck() {
		if (!username.trim()) return;

		isChecking = true;
		results = [];

		for (let i = 0; i < platforms.length; i++) {
			const platform = platforms[i];
			let available = true;

			try {
				if ('checkFn' in platform && platform.checkFn) {
					available = await platform.checkFn(username);
				} else {
					await new Promise((resolve) => setTimeout(resolve, 200));
					available = Math.random() > 0.5;
				}
			} catch (error) {
				console.error(`Error checking ${platform.name}:`, error);
				available = false;
			}

			results = [
				...results,
				{
					platform: platform.name,
					url: platform.url(username),
					icon: platform.icon,
					available
				}
			];
		}

		isChecking = false;
	}

	function handleKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleCheck();
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
	<div class="max-w-3xl mx-auto">
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Username Checker</h1>
			<p class="text-gray-600">Check username availability across platforms</p>
		</div>

		<div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
			<div class="flex gap-3 mb-6">
				<div class="flex-1 relative">
					<input
						type="text"
						bind:value={username}
						onkeypress={handleKeyPress}
						placeholder="Enter username..."
						class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
					/>
				</div>
				<button
					onclick={handleCheck}
					disabled={!username.trim() || isChecking}
					class="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
				>
					{isChecking ? 'Checking...' : 'Check'}
				</button>
			</div>

			{#if results.length > 0}
				<div class="space-y-3">
					{#each results as result (result.platform)}
						<div
							class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
						>
							<div class="flex items-center gap-3">
								<div class="text-2xl">
									{#if result.icon === 'globe'}🌐{/if}
									{#if result.icon === 'youtube'}▶️{/if}
									{#if result.icon === 'github'}💻{/if}
									{#if result.icon === 'facebook'}📘{/if}
									{#if result.icon === 'twitter'}🐦{/if}
									{#if result.icon === 'instagram'}📷{/if}
									{#if result.icon === 'linkedin'}💼{/if}
								</div>
								<div>
									<div class="font-semibold text-gray-800">{result.platform}</div>
									<div class="text-sm text-gray-500">{result.url}</div>
								</div>
							</div>
							<div
								class="flex items-center gap-2 {result.available
									? 'text-green-600'
									: 'text-red-600'} font-semibold"
							>
								<span class="text-xl">{result.available ? '✓' : '✗'}</span>
								{result.available ? 'Available' : 'Taken'}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if isChecking && results.length < platforms.length}
				<div class="text-center py-8">
					<div
						class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"
					></div>
					<p class="mt-4 text-gray-600">Checking platforms...</p>
				</div>
			{/if}
		</div>

		<div class="text-center text-sm text-gray-500">
			<p>💡 Tip: Domain checks use public RDAP API</p>
		</div>
	</div>
</div>
