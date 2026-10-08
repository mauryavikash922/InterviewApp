Build a Seat Booking app in React Native.

I have to build this application .
We have 2 screen (bottom tab screens )

1. Search page (user lands on this by default whenever he launch the app ) (bottom tab screen)
   here user can select the source -> destination . This is how the screen would look like ( Make a simple ui not heavy one )
   +----------------------------------------+
   | Book Your Journey |
   +----------------------------------------+
   | |
   | From |
   | +----------------------------------+ |
   | | Mumbai | |
   | +----------------------------------+ |
   | |
   | To |
   | +----------------------------------+ |
   | | Delhi | |
   | +----------------------------------+ |
   | |
   | Date |
   | +----------------------------------+ |
   | | 15 Sep 2026 [ Pick ] | |
   | +----------------------------------+ |
   | |
   | Passengers |
   | +----------------------------------+ |
   | | [-] 2 [+] | |
   | +----------------------------------+ |
   | |
   | Seat Preference |
   | ( ) Window ( ) Aisle (x) Any |
   | |
   | [ Search Seats ] |
   +----------------------------------------+

After clicking on search seat user land to seat Map Screen

Search
User enters origin, destination, travel date, number of passengers (1–6), and an optional seat preference (Window / Aisle / Any)
const indianCities = [ "Mumbai", "Delhi", "Bengaluru", "Kolkata", "Chennai", "Hyderabad", "Ahmedabad", "Pune", "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara" ];
Validations: origin and destination cannot be the same; date cannot be in the past; at least 1 passenger

2. Seat Map Screen
   +----------------------------------------+
   | <- Mumbai --> Delhi |
   | 15 Sep | 2 passengers |
   +----------------------------------------+
   | Legend: [ ] Available |
   | [XX] Occupied |
   | [>>] Selected |
   +----------------------------------------+
   | A B C | D E F |
   | | |
   | 01 [ ] [ ] [ ]| [ ] [XX] [ ] |
   | 02 [ ] [XX] [ ]| [ ] [ ] [ ] |
   | 03 [>>] [>>] [ ]| [ ] [ ] [ ] | <- selected
   | 04 [ ] [ ] [ ]| [ ] [XX] [XX] |
   | 05 [ ] [ ] [XX]| [ ] [ ] [ ] |
   | 06 [ ] [XX] [ ]| [ ] [ ] [ ] |
   | 07 [ ] [ ] [ ]| [XX] [ ] [ ] |
   | 08 [XX] [ ] [ ]| [ ] [ ] [ ] |
   | |
   | Selected: 3A, 3B (2 / 2 seats) |
   | Hold expires in: 04:32 |
   | |
   | [ Suggest Best Seats ] |
   | |
   | [ Proceed to Details ] |
   +----------------------------------------+
   — Seat Map
   Display a grid of seats grouped as A-B-C | D-E-F (aisle in the middle)
   Seat states: Available, Occupied (pre-seeded, cannot be selected), Selected (by current user)
   User can tap to select/deselect available seats
   Maximum selected seats = number of passengers from search
   A "Suggest Best Seats" button auto-selects the best available seats based on preference and adjacency

- Seat Hold Timer
  When the first seat is selected, a 5-minute countdown timer starts and is visible on screen
  If the timer reaches 0:00 before the booking is confirmed, all selected seats are released and the user is shown a timeout message
  Timer resets only if the user deselects all seats

- Seat Suggestion Algorithm
  Given the passenger count and seat preference, suggest the best available seats
  Priority: (1) all passengers adjacent in the same row, (2) same side of aisle, (3) closest to front
  If no full-row adjacency is possible, split into the largest possible adjacent groups

When user click on proceed detail mov etop passenger detail

3. Passenger detail
   +----------------------------------------+
   | <- Passenger Details |
   +----------------------------------------+
   | |
   | Passenger 1 (Seat 3A) |
   | +----------------------------------+ |
   | | Full Name | |
   | +----------------------------------+ |
   | +----------------------------------+ |
   | | Age | |
   | +----------------------------------+ |
   | Gender: (x) Male ( ) Female ( ) Other
   | |
   | - - - - - - - - - - - - - - - - - - |
   | |
   | Passenger 2 (Seat 3B) |
   | +----------------------------------+ |
   | | Full Name | |
   | +----------------------------------+ |
   | +----------------------------------+ |
   | | Age | |
   | +----------------------------------+ |
   | Gender: ( ) Male (x) Female ( ) Other
   | |
   | [ Confirm Booking ] |
   +----------------------------------------+

Passenger Details
One form entry per passenger, linked to the seat they are assigned
Required fields: Full Name (non-empty), Age (1–120), Gender
Seats are assigned in selection order (first seat selected → Passenger 1, etc.)

as user click on confirm booking move to Booking Confirmation screen

4. Booking Confirmation Screen

+----------------------------------------+
| Booking Confirmed! |
+----------------------------------------+
| |
| Booking ID: BK-20260915-4821 |
| |
| Mumbai --> Delhi |
| 15 Sep 2026 |
| |
| +----------------------------------+ |
| | Passenger Seat Age Gender | |
| |----------------------------------| |
| | Rahul Sharma 3A 28 M | |
| | Priya Singh 3B 25 F | |
| +----------------------------------+ |
| |
| Status: CONFIRMED |
| |
| [ View All Bookings ] [ Share ] |
+----------------------------------------+

when user click on View All Bookings navigfate to my order listing screen

- skip share implementation

Booking Confirmation & Persistence
On confirm, generate a booking ID and save the booking locally
Booking must survive app restart
All bookings are listed in "My Bookings" screen with status (CONFIRMED / EXPIRED)

5. My order listing Booking confirmation screen (bottom tab screen)

+----------------------------------------+
| My Bookings |
+----------------------------------------+
| |
| +----------------------------------+ |
| | BK-20260915-4821 | |
| | Mumbai --> Delhi | |
| | 15 Sep 2026 | Seats: 3A, 3B | |
| | Status: CONFIRMED [View] | |
| +----------------------------------+ |
| |
| +----------------------------------+ |
| | BK-20260820-1032 | |
| | Delhi --> Bangalore | |
| | 20 Aug 2026 | Seat: 12F | |
| | Status: EXPIRED [View] | |
| +----------------------------------+ |
| |
| No more bookings |
+----------------------------------------+

- For persistent behaviour lets use async storage
- for listing of my order use flatlist

Data structure for my order listing

OrderItem{
id:string;
source:string;
destination:string;
seats:string[];
status:CONFIRMED | EXPIRED
bookingData:string ;
}
