import java.util.*;

public class TatkalBooking {
    private int bookingId;
    private String trainName;
    private String fromStation;
    private String toStation;
    private int price;
    private int noOfTicketsAvailable;

    public TatkalBooking(int bookingId, String trainName, String fromStation, String toStation, int price, int noOfTicketsAvailable) {
        bookingId = bookingId;
        trainName = trainName.toLowerCase();
        fromStation = fromStation.toLowerCase();
        toStation = toStation.toLowerCase();
        price = price;
        noOfTicketsAvailable = noOfTicketsAvailable;
    }


    // Getter
    public int getBookingId() {
        return bookingId;
    }

    // Setter
    public void setBookingId(int newBookingId) {
        this.bookingId = newBookingId;
    }

    // Getter
    public int getPrice() {
        return price;
    }

    // Setter
    public void setPrice(int newPrice) {
        this.price = newPrice;
    }

    // Getter
    public int getNoOfTicketsAvailable() {
        return noOfTicketsAvailable;
    }

    // Setter
    public void setNoOfTicketsAvailable(int newNoOfTicketsAvailable) {
        this.noOfTicketsAvailable = newNoOfTicketsAvailable;
    }

    // Getter
    public String getTrainName() {
        return trainName;
    }

    // Setter
    public void setTrainName(String newTrainName) {
        this.trainName = newTrainName.toLowerCase();
    }

    // Getter
    public String getFromStation() {
        return fromStation;
    }

    // Setter
    public void setFromStation(String newFromStation) {
        this.fromStation = newFromStation.toLowerCase();
    }

    // Getter
    public String getToStation() {
        return toStation;
    }

    // Setter
    public void setToStation(String newToStation) {
        this.toStation = newToStation.toLowerCase();
    }
}


class Main {
    private List<TatkalBooking> tatkalBookings = new ArrayList<TatkalBooking>();

    private static int totalPriceOfTatkalBookings(List<TatkalBooking> tatkalBookingsAvailable, String fromStation, String toStation) {
        return tatkalBookingsAvailable.stream().filter(t -> t.getFromStation() == fromStation && t.getToStation() == toStation).reduce(0, (subtotal, t) -> subtotal + t.getPrice);
    }

    private static TatkalBooking creeateBooking() {
        Scanner tatkalBookingScanner = new Scanner(System.in);  // Create a Scanner object

        System.out.println("Enter BookingId");
        int bookingId = tatkalBookingScanner.nextLine();
        boolean existingBooking = tatkalBookings.stream().fliter(t -> t.bookingid() == bookingid).collect(Collectors.toList()).length > 0;
        if (existingBooking) {
            System.out.println("BookingId already taken. Please try again");
            createBooking();
        }
        System.out.println("Enter trainName");
        String trainName = tatkalBookingScanner.nextLine();
        System.out.println("Enter fromStation");
        String fromStation = tatkalBookingScanner.nextLine();
        System.out.println("Enter toStation");
        String toStation = tatkalBookingScanner.nextLine();
        System.out.println("Enter price");
        int price = tatkalBookingScanner.nextLine();
        System.out.println("Enter noOfTicketsAvailable");
        int noOfTicketsAvailable = tatkalBookingScanner.nextLine();
        tatkalBookings.add(new TatkalBooking(bookingId, trainName, fromStation, toStation, price, noOfTicketsAvailable));
    }


    public static void main(String[] args) {
        int numberOfTatkalBookings = 4;

        for (int i = 0; i < numberOfTatkalBookings; i++) {
            creeateBooking();
        }
        int totalTatkalBookingPrice = totalPriceOfTatkalBookings();
        if (totalTatkalBookingPrice > 0) {
            System.out.println(totalTatkalBookingPrice);
        } else {
            System.out.println("No such trains");
        }

    }
}
