const { supabase } = require('./config/supabase');

async function addTimeSlots() {
  console.log('📅 Adding default time slots...');
  
  try {
    // Generate time slots for next 30 days (weekdays only)
    const slots = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Morning slots: 11:00 AM - 1:00 PM
      const morningSlots = ['11:00', '11:30', '12:00', '12:30', '13:00'];
      
      // Afternoon slots: 3:00 PM - 5:00 PM  
      const afternoonSlots = ['15:00', '15:30', '16:00', '16:30', '17:00'];
      
      const allSlots = [...morningSlots, ...afternoonSlots];
      
      for (const timeSlot of allSlots) {
        // Add slots for both offices
        slots.push({
          date: dateStr,
          time_slot: timeSlot,
          duration_minutes: 30,
          office_location: 'tis_hazari',
          consultation_type: 'both',
          is_available: true
        });
        
        slots.push({
          date: dateStr,
          time_slot: timeSlot,
          duration_minutes: 30,
          office_location: 'preet_vihar',
          consultation_type: 'both',
          is_available: true
        });
      }
    }
    
    console.log(`📊 Generated ${slots.length} time slots`);
    
    // Insert slots in batches of 100
    const batchSize = 100;
    let inserted = 0;
    
    for (let i = 0; i < slots.length; i += batchSize) {
      const batch = slots.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('available_slots')
        .insert(batch);
      
      if (error) {
        console.error('❌ Error inserting batch:', error);
      } else {
        inserted += batch.length;
        console.log(`✅ Inserted batch: ${inserted}/${slots.length}`);
      }
    }
    
    console.log(`🎉 Successfully added ${inserted} time slots!`);
    
    // Test query
    const { data: testSlots, error: testError } = await supabase
      .from('available_slots')
      .select('*')
      .limit(5);
    
    if (testError) {
      console.error('❌ Test query failed:', testError);
    } else {
      console.log('📋 Sample slots:');
      testSlots.forEach(slot => {
        console.log(`   ${slot.date} ${slot.time_slot} - ${slot.office_location}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Failed to add time slots:', error);
  }
}

addTimeSlots();