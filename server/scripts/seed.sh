#!/bin/bash
# Seed initial data for exercises and equipment

echo "Seeding database..."

# Wait for MongoDB to be ready
until mongosh --host mongodb --eval "db.adminCommand('ping')" &>/dev/null; do
    echo "Waiting for MongoDB..."
    sleep 2
done

echo "MongoDB is ready. Seeding data..."

cd /app

# Seed exercises
echo "Seeding exercises..."
node scripts/seedExercises.js

# Seed equipment
echo "Seeding equipment..."
node scripts/seedEquipment.js

# Seed default weekly schedule for users without one
echo "Seeding default schedules..."
node scripts/seedSchedule.js

echo "Database seeding complete!"
