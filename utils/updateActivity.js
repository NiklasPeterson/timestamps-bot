const { ActivityType } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Initialize Supabase with optimized options
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
	{
		auth: { persistSession: false },
		db: { schema: 'public' }
	}
);

async function updateBotActivity(client) {
	try {
		const serverCount = client.guilds.cache.size;

		// Update Discord activity first for immediate user feedback
		await client.user.setActivity(`Used in ${serverCount} servers`, { 
			type: ActivityType.Custom 
		});

		// Update Supabase
		const { error } = await supabase
			.from('server_stats')
			.upsert({ 
				id: 1,
				server_count: serverCount,
				updated_at: new Date().toISOString()
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Supabase update failed: ${error.message}`);
		}

		console.log(`Successfully updated server count to ${serverCount}`);

	} catch (error) {
		console.error('Error in updateBotActivity:', error.message);
	}
}

module.exports = {
	updateBotActivity,
};