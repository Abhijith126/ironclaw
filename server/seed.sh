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
node seedExercises.js

# Seed equipment
echo "Seeding equipment..."
node seedEquipment.js

echo "Database seeding complete!"
