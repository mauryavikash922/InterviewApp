type StringTree = { readonly [key: string]: string | StringTree };

export const en = {
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    done: 'Done',
    close: 'Close',
    retry: 'Retry',
    loading: 'Loading…',
    genericError: 'Something went wrong. Please try again.',
    route: '{{source}} → {{destination}}',
    passengerCountOne: '{{count}} passenger',
    passengerCountOther: '{{count}} passengers',
    status: {
      CONFIRMED: 'CONFIRMED',
      EXPIRED: 'EXPIRED',
    },
  },
  tabs: {
    search: 'Search',
    myBookings: 'My Bookings',
  },
  date: {
    months: {
      jan: 'Jan',
      feb: 'Feb',
      mar: 'Mar',
      apr: 'Apr',
      may: 'May',
      jun: 'Jun',
      jul: 'Jul',
      aug: 'Aug',
      sep: 'Sep',
      oct: 'Oct',
      nov: 'Nov',
      dec: 'Dec',
    },
  },
  search: {
    title: 'Book Your Journey',
    fromLabel: 'From',
    toLabel: 'To',
    dateLabel: 'Date',
    pickDate: 'Pick',
    passengersLabel: 'Passengers',
    preferenceLabel: 'Seat Preference',
    cityPlaceholder: 'Select city',
    datePlaceholder: 'Select date',
    originPickerTitle: 'Select origin',
    destinationPickerTitle: 'Select destination',
    datePickerTitle: 'Select travel date',
    submit: 'Search Seats',
    preference: {
      WINDOW: 'Window',
      AISLE: 'Aisle',
      ANY: 'Any',
    },
    stepper: {
      decrement: '−',
      increment: '+',
    },
    a11y: {
      decrementPassengers: 'Decrease passengers',
      incrementPassengers: 'Increase passengers',
      pickDate: 'Pick travel date',
      selectOrigin: 'Select origin city',
      selectDestination: 'Select destination city',
      preferenceOption: 'Seat preference {{option}}',
    },
    errors: {
      originRequired: 'Please select an origin city.',
      destinationRequired: 'Please select a destination city.',
      sameCity: 'Origin and destination cannot be the same.',
      dateRequired: 'Please select a travel date.',
      pastDate: 'Travel date cannot be in the past.',
      minPassengers: 'At least {{min}} passenger is required.',
      maxPassengers: 'You can book at most {{max}} passengers.',
    },
  },
  seatMap: {
    title: 'Select Seats',
    subtitle: '{{date}} | {{passengers}}',
    legendTitle: 'Legend',
    legend: {
      AVAILABLE: 'Available',
      OCCUPIED: 'Occupied',
      SELECTED: 'Selected',
    },
    selectedSummary: 'Selected: {{seats}} ({{count}} / {{max}} seats)',
    selectedNone: 'Selected: none (0 / {{max}} seats)',
    holdExpiresIn: 'Hold expires in: {{time}}',
    maxSeatsHint: 'Max {{max}} seats',
    selectMoreHint: 'Select {{remaining}} more seat(s) to proceed',
    suggest: 'Suggest Best Seats',
    proceed: 'Proceed to Details',
    notEnoughSeats: 'Only {{available}} seats available',
    timeoutTitle: 'Seat hold expired',
    timeoutMessage:
      'Your 5-minute seat hold has expired and the selected seats were released. Please select your seats again.',
    loading: 'Loading seat map…',
    error: 'Could not load the seat map.',
    retry: 'Retry',
    a11y: {
      seat: 'Seat {{seat}}, {{state}}',
      row: 'Row {{row}}',
    },
  },
  passengerDetails: {
    title: 'Passenger Details',
    passengerHeading: 'Passenger {{n}} (Seat {{seat}})',
    namePlaceholder: 'Full Name',
    agePlaceholder: 'Age',
    genderLabel: 'Gender:',
    gender: {
      MALE: 'Male',
      FEMALE: 'Female',
      OTHER: 'Other',
    },
    holdExpiresIn: 'Hold expires in: {{time}}',
    confirm: 'Confirm Booking',
    confirming: 'Confirming…',
    errors: {
      nameRequired: 'Full name is required.',
      ageRequired: 'Age is required.',
      ageInvalid: 'Age must be a whole number between {{min}} and {{max}}.',
      genderRequired: 'Please select a gender.',
      fixErrors: 'Please fix the highlighted fields.',
      confirmFailed: 'Could not save your booking. Please try again.',
    },
    holdExpiredTitle: 'Seat hold expired',
    holdExpiredMessage:
      'Your seat hold has expired and the seats were released. Please select your seats again.',
    a11y: {
      genderOption: 'Gender {{option}}',
    },
  },
  confirmation: {
    titleConfirmed: 'Booking Confirmed!',
    titleView: 'Booking Details',
    bookingId: 'Booking ID: {{id}}',
    table: {
      passenger: 'Passenger',
      seat: 'Seat',
      age: 'Age',
      gender: 'Gender',
    },
    status: 'Status: {{status}}',
    viewAllBookings: 'View All Bookings',
    share: 'Share',
    genderShort: {
      MALE: 'M',
      FEMALE: 'F',
      OTHER: 'O',
    },
    notFound: 'Booking not found.',
  },
  myBookings: {
    title: 'My Bookings',
    seatsOne: 'Seat: {{seats}}',
    seatsOther: 'Seats: {{seats}}',
    dateAndSeats: '{{date}} | {{seats}}',
    status: 'Status: {{status}}',
    view: 'View',
    noMore: 'No more bookings',
    empty: 'No bookings yet',
    emptyHint: 'Your confirmed bookings will appear here.',
    loading: 'Loading bookings…',
    error: 'Could not load your bookings.',
    retry: 'Retry',
  },
} as const satisfies StringTree;

type Leaves<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : Leaves<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type StringKey = Leaves<typeof en>;
export type StringParams = Readonly<Record<string, string | number>>;

const flatten = (
  tree: StringTree,
  prefix: string,
  out: Map<string, string>,
): Map<string, string> => {
  Object.entries(tree).forEach(([key, value]) => {
    const path = `${prefix}${key}`;
    if (typeof value === 'string') {
      out.set(path, value);
    } else {
      flatten(value, `${path}.`, out);
    }
  });
  return out;
};

const FLAT_STRINGS: ReadonlyMap<string, string> = flatten(en, '', new Map());
const PLACEHOLDER_PATTERN = /\{\{(\w+)\}\}/g;

export const strings = (key: StringKey, params?: StringParams): string => {
  const template = FLAT_STRINGS.get(key) ?? key;
  if (!params) {
    return template;
  }
  return template.replace(PLACEHOLDER_PATTERN, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
};
