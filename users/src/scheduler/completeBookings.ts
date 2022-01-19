import cron from "node-cron";
import { ApiError, BadRequestError, User, Bookings } from "@ezzify/common/build";

const cronJob = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("running");

    const findBookings = await Bookings.find({
      $and: [
        {
          status: "active",
        },
        {
          createdAt: {
            $lt: new Date().setHours(0, 0, 0, 0),
          },
        },
      ],
    });

    const toggleFlag = await findBookings.map(async (x: any) => {
      x.status = "completed";
      await x.save();
    });
  });
};

export default cronJob;
