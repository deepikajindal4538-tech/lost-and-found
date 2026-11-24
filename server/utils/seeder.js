import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import Report from '../models/Report.js';
import { connectDB } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

export const seedData = async () => {
  try {
    console.log('🌱 Seeding sample campus data for IIIT Allahabad...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Claim.deleteMany({}),
      Report.deleteMany({}),
    ]);

    // Create Users
    const admin = await User.create({
      name: 'IIITA Security & Care Desk',
      email: 'admin@iiita.ac.in',
      rollNumber: 'ADM202401',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 532 292 2000',
    });

    const studentRahul = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@iiita.ac.in',
      rollNumber: 'IIT2023045',
      password: 'Student@123',
      role: 'student',
      phone: '+91 98765 43210',
    });

    const studentPriya = await User.create({
      name: 'Priya Verma',
      email: 'priya.verma@iiita.ac.in',
      rollNumber: 'IIT2023112',
      password: 'Student@123',
      role: 'student',
      phone: '+91 91234 56789',
    });

    const studentAmit = await User.create({
      name: 'Amit Patel',
      email: 'amit.patel@iiita.ac.in',
      rollNumber: 'IIT2022089',
      password: 'Student@123',
      role: 'student',
      phone: '+91 98111 22334',
    });

    console.log('✅ Users seeded successfully.');

    // Seed realistic items
    const sampleItems = [
      {
        title: 'Apple AirPods Pro (2nd Gen) in White MagSafe Case',
        type: 'found',
        category: 'Electronics',
        description: 'Found on the 2nd floor silent reading room table in Central Library. The case has a slight scratch on the hinge and a small blue silicone dust plug.',
        location: 'Central Library',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Serial number starts with H2X... Please describe the engraving if any or connect phone via Bluetooth to verify.',
        postedBy: studentPriya._id,
        status: 'open',
      },
      {
        title: 'Calculus and Linear Algebra Textbook (Gilbert Strang)',
        type: 'lost',
        category: 'Books & Stationery',
        description: 'Hardcover mathematics textbook left behind after the 10:00 AM lecture in CC3 Room 104. Has highlighted pages in Chapter 4 and my notes in pencil.',
        location: 'CC3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'My name is written faintly on the top right of the inside cover page.',
        postedBy: studentRahul._id,
        status: 'open',
      },
      {
        title: 'IIITA Student Identity Card — Roll No. IIT2023045',
        type: 'found',
        category: 'ID Cards & Documents',
        description: 'Official RFID campus identity card found on a dining table in Boys Hostel 4 Mess after dinner hours. Handed over to the hostel guard desk.',
        location: 'Mess',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1589330694653-dad6bc01cf0f?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Card is safely kept with BH-4 caretaker. Please bring your duplicate ID or portal login to collect.',
        postedBy: studentAmit._id,
        status: 'open',
      },
      {
        title: 'Wildcraft Black & Navy Blue Laptop Backpack',
        type: 'lost',
        category: 'Bags',
        description: 'Left inadvertently near the water cooler outside Academic Block 2 Lecture Hall 1. Contains a Lenovo charger, spiral notebook, and green umbrella.',
        location: 'Academic Blocks',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Has a small metallic compass keychain attached to the main zipper.',
        postedBy: studentRahul._id,
        status: 'open',
      },
      {
        title: 'Room Keys with Captain America Metal Shield Keychain',
        type: 'found',
        category: 'Keys',
        description: 'Pair of brass door keys with a Godrej lock key and a circular metallic Marvel shield tag found on the stone benches outside the Auditorium.',
        location: 'Auditorium',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Total 3 keys on the ring. Mention the hostel room number engraved on the tag to verify.',
        postedBy: studentPriya._id,
        status: 'open',
      },
      {
        title: 'Boat Rockerz 450 Bluetooth Over-Ear Headphones (Beige)',
        type: 'found',
        category: 'Electronics',
        description: 'Found resting on the bleachers beside Court 2 at the Sports Complex after the evening badminton session.',
        location: 'Sports Complex',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Small sticker mark on the right ear cushion.',
        postedBy: studentAmit._id,
        status: 'open',
      },
      {
        title: 'Milton Thermosteel 750ml Matte Black Water Bottle',
        type: 'lost',
        category: 'Water Bottles',
        description: 'Left on desk 34 in Lab 3 (CC3 building) during the Data Structures lab session. Has a distinctive dent at the bottom base.',
        location: 'Labs',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Contains a small sticker that says "Keep Coding".',
        postedBy: studentAmit._id,
        status: 'open',
      },
      {
        title: 'Fastrack Grey Sport Sunglasses with Black Case',
        type: 'found',
        category: 'Accessories',
        description: 'Found on the grass lawn in front of Girls Hostel 1. The sunglasses are in pristine condition inside a zippered case.',
        location: 'Hostels',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Case has a microfiber cleaning cloth inside.',
        postedBy: admin._id,
        status: 'returned',
      },
      {
        title: 'Titan Karishma Classic Leather Watch (Brown Strap)',
        type: 'lost',
        category: 'Accessories',
        description: 'Lost somewhere between the Central Library walkway and Academic Block 1. Roman numeral dial with brown genuine leather strap.',
        location: 'Academic Blocks',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'Sentimental gift from family. Would be extremely grateful for its return!',
        postedBy: studentPriya._id,
        status: 'open',
      },
      {
        title: 'Navy Blue Hooded Sweatshirt (Size L, Nike)',
        type: 'found',
        category: 'Clothing',
        description: 'Left on the chair in Central Library Ground Floor reading room. Clean and washed.',
        location: 'Central Library',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        additionalDetails: 'White swoosh logo on chest.',
        postedBy: studentRahul._id,
        status: 'returned',
      },
    ];

    const createdItems = await Item.insertMany(sampleItems);
    console.log(`✅ ${createdItems.length} items seeded successfully.`);

    // Seed a sample Claim
    const foundAirpods = createdItems.find((i) => i.title.includes('AirPods'));
    if (foundAirpods) {
      await Claim.create({
        itemId: foundAirpods._id,
        claimantId: studentRahul._id,
        ownerId: foundAirpods.postedBy,
        message: 'Hello Priya, I think these AirPods are mine! I was studying at desk 14 on the 2nd floor library between 3 PM and 5 PM yesterday. The case has a slight scratch right along the rear chrome hinge and connects to Bluetooth as "Rahul\'s Pods".',
        contactDetails: 'Telegram: @rahul_iiita | Room: BH-3 Room 214',
        status: 'pending',
      });
      console.log('✅ Sample claim seeded.');
    }

    // Seed a sample Report for Admin
    const lostBackpack = createdItems.find((i) => i.title.includes('Backpack'));
    if (lostBackpack) {
      await Report.create({
        itemId: lostBackpack._id,
        reportedBy: studentAmit._id,
        reason: 'Item already returned',
        additionalInfo: 'Saw Rahul carrying this same backpack today near CC3, looks like he found it!',
        status: 'pending',
      });
      console.log('✅ Sample report seeded.');
    }

    console.log('🎉 IIITA CampusKhoj Database Seeding Complete!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
};

// If run directly via node seeder.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}
