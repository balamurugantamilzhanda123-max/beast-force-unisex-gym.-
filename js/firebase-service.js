import {
  firebase,
  isFirebaseConfigured,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "./firebase-config.js";

const storagePrefix = "beastForce:";

export const defaultData = {
  plans: [
    { id: "monthly", name: "Monthly", price: "₹1,499", featured: false, benefits: ["Full gym access", "Cardio and strength zones", "Basic trainer guidance", "Locker access"] },
    { id: "quarterly", name: "Quarterly", price: "₹3,999", featured: false, benefits: ["Everything in Monthly", "Body assessment", "Diet guidance", "Priority trainer support"] },
    { id: "half-yearly", name: "Half-Yearly", price: "₹6,999", featured: true, benefits: ["Everything in Quarterly", "Transformation tracking", "Personalized workout split", "Steam room access if available"] },
    { id: "yearly", name: "Yearly", price: "₹11,999", featured: false, benefits: ["Best value access", "Quarterly assessment", "Guest workout passes", "Supplement store discounts"] }
  ],
  trainers: [
    { id: "boys-trainer", role: "Boys Trainer", name: "Arjun Malik", experience: "8+ years", specialization: "Strength, hypertrophy, fat loss", intro: "Known for disciplined programs and sharp form correction.", photo: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=700&q=80" },
    { id: "girls-trainer", role: "Girls Trainer", name: "Priya Sharma", experience: "6+ years", specialization: "Weight loss, toning, functional fitness", intro: "Builds confident, sustainable routines for women at every level.", photo: "https://images.unsplash.com/photo-1609899464726-209befaac5a5?auto=format&fit=crop&w=700&q=80" }
  ],
  amenities: [
    ["Air Conditioned Gym", "fa-solid fa-snowflake", "Comfortable climate for intense training sessions."],
    ["Cardio Zone", "fa-solid fa-heart-pulse", "Treadmills, cycles, cross trainers, and endurance equipment."],
    ["Strength Training Area", "fa-solid fa-dumbbell", "Machines and benches for progressive overload."],
    ["Functional Training", "fa-solid fa-person-running", "Space for HIIT, mobility, and athletic movement."],
    ["Free Weights", "fa-solid fa-weight-hanging", "Dumbbells, plates, barbells, and racks."],
    ["Personal Training", "fa-solid fa-user-check", "Focused coaching for faster and safer results."],
    ["Locker Facility", "fa-solid fa-lock", "Secure storage during workouts."],
    ["Parking", "fa-solid fa-square-parking", "Convenient parking for members."],
    ["Drinking Water", "fa-solid fa-bottle-water", "Hydration support on the gym floor."],
    ["Washrooms", "fa-solid fa-restroom", "Clean member facilities."],
    ["Changing Rooms", "fa-solid fa-shirt", "Private changing areas."],
    ["Music System", "fa-solid fa-music", "High-energy training atmosphere."],
    ["CCTV Security", "fa-solid fa-video", "Monitored facility for member safety."],
    ["Steam Room", "fa-solid fa-cloud", "Recovery amenity, subject to availability."],
    ["Supplement Store", "fa-solid fa-store", "Fitness essentials and supplements, subject to availability."]
  ].map(([name, icon, description], index) => ({ id: `amenity-${index}`, name, icon, description })),
  gallery: [
    ["Strength Floor", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80"],
    ["Cardio Zone", "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80"],
    ["Free Weights", "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80"],
    ["Personal Training", "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80"],
    ["Functional Zone", "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80"],
    ["Transformation Space", "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=900&q=80"]
  ].map(([caption, url], index) => ({ id: `gallery-${index}`, caption, url })),
  testimonials: [
    { name: "Rohit K.", text: "The trainers corrected my form in the first week. The gym feels serious, clean, and motivating." },
    { name: "Sneha P.", text: "I joined for fat loss and stayed for the community. The girls trainer support made a huge difference." },
    { name: "Vikram S.", text: "Premium equipment, powerful atmosphere, and no wasted time. Exactly what I wanted." }
  ],
  faq: [
    ["Do beginners get trainer support?", "Yes. New members receive basic guidance and can upgrade to personal training."],
    ["Is the gym suitable for women?", "Yes. Beast Force is a unisex gym with separate boys and girls trainer support."],
    ["Can I pay at the gym?", "Yes. The online form records your subscription request and payment can be completed at reception."],
    ["Are timings different on holidays?", "Holiday hours are announced at reception and on official social channels."]
  ].map(([question, answer]) => ({ question, answer }))
};

export function localGet(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(storagePrefix + key)) || fallback;
  } catch {
    return fallback;
  }
}

export function localSet(key, value) {
  localStorage.setItem(storagePrefix + key, JSON.stringify(value));
}

export async function getCollection(name, fallback = []) {
  if (!isFirebaseConfigured) {
    return localGet(name, fallback);
  }

  const snapshot = await getDocs(collection(firebase.db, name));
  const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return data.length ? data : fallback;
}

export async function addRecord(name, payload) {
  const record = {
    ...payload,
    createdAt: new Date().toISOString()
  };

  if (!isFirebaseConfigured) {
    const current = localGet(name, []);
    const id = payload.id || `local-${Date.now()}`;
    const next = [{ id, ...record }, ...current.filter((item) => item.id !== id)];
    localSet(name, next);
    return { id, local: true };
  }

  const docRef = await addDoc(collection(firebase.db, name), {
    ...payload,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id };
}

export async function setRecord(name, id, payload) {
  if (!isFirebaseConfigured) {
    const current = localGet(name, []);
    const exists = current.some((item) => item.id === id);
    const next = exists
      ? current.map((item) => item.id === id ? { ...item, ...payload } : item)
      : [{ id, ...payload }, ...current];
    localSet(name, next);
    return;
  }

  await setDoc(doc(firebase.db, name, id), payload, { merge: true });
}

export async function removeRecord(name, id) {
  if (!isFirebaseConfigured) {
    localSet(name, localGet(name, []).filter((item) => item.id !== id));
    return;
  }

  await deleteDoc(doc(firebase.db, name, id));
}
