[](../src/store.ts)

# Vuex Notes

By: Ein Chang?

### We now use global data!

- without global data (and what we were doing previously) was having one entry point [Dashboard.vue] & pass it down continuously. Sometimes, some children components didn't need the global data but their children needed it so we kept passing the data down
- now, data is in one place so we don't have to pass it down
- this is better than global variables because when state changes, Vue re-renders. If we only change global variables, Vue doesn't know. So we use a management system: Vuex.

### How to read data

- import store
- the types for the data is in store.ts in VuexStoreState
- usually the types correspond to the ones found in the Firestore Database. For example, username in Vuex = username in Database
- example: getting the color for a course. When you change the color of a course, this should be reflected both in the schedule view AND requirements bar bc we want it in sync everywhere. And this value is in Vuex. We can get it by importing store, and then doing something like store.state.derivedCourseData

### How to write data

- Vuex doesn't let you write data arbitrarily
- it is indirectly performed by mutations (which have to be defined in ordered to be used)
- do store.commit (mutation name, payload) where payload is the data you pass in
- this only changes the global store, not the Firestore database

### Pattern

- we write to the data base → the db writes to Vuex → components subscribe to Vuex
  - then everything is consistent! 😇
- .onSnapshot() listens to Firebase real time which lets us know every time the database updates
- So we listen for data base changes, then update the global data store

Why don't we just update the data store, why do we listen from Firebase?

- We want to maintain the variant where store.commit is inside listeners. We do have exceptions for this

We write to the Datastore directly in global-firestore-data.ts

### Exception for Semester Collection Data

- When writing to the database and then db pushes changes, it's usually fast but sometimes there are latencies which is not sufficient for drag and drop
  - Because after you drop the course, users should see this immediately we don't use .onSnapshot() for dragging courses, but rather write to Vuex first and then Firebase.
  - So no latency for drag & drop <3
