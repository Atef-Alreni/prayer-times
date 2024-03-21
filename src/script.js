const DAY = new Date().getDate();
const MONTH = new Date().getMonth();
const YEAR = new Date().getFullYear();
const LATITUDE = "51.580559";
const LONGITUDE = "-0.341995";
const METHOD = "2";

async function getTimings() {
  const baseUrl = "https://api.aladhan.com/v1/calendar";
  const formattedUrl = `${baseUrl}/${YEAR}/${
    MONTH + 1
  }?latitude=${LATITUDE}&longitude=${LONGITUDE}&method=${METHOD}`;

  const res = await fetch(formattedUrl);
  return await res.json();
}

async function main() {
  const timingDiv = document.getElementsByClassName(
    "midnight-container__timing"
  );

  const prayerTimings = await getTimings();

  const maghribDateString = prayerTimings.data[DAY - 1].date.gregorian.date;
  const [maghribDay, maghribMonth, maghribYear] = maghribDateString
    .split("-")
    .map(Number);
  const maghribTime = prayerTimings.data[DAY - 1].timings.Maghrib.split(" ")[0];
  const [maghribHour, maghribMinute] = maghribTime.split(":").map(Number);

  const fajrDateString = prayerTimings.data[DAY].date.gregorian.date;
  const [fajrDay, fajrMonth, fajrYear] = fajrDateString.split("-").map(Number);
  const fajrTime = prayerTimings.data[DAY].timings.Fajr.split(" ")[0];
  const [fajrHour, fajrMinute] = fajrTime.split(":").map(Number);

  const maghrib = new Date(
    maghribDay,
    maghribMonth - 1,
    maghribYear,
    maghribHour,
    maghribMinute,
    0
  ); // Month is zero based

  const fajr = new Date(
    fajrDay,
    fajrMonth - 1,
    fajrYear,
    fajrHour,
    fajrMinute,
    0
  );

  const middleTotalSeconds = (fajr - maghrib) / 2 / 1000;
  const middleHours = Math.floor(middleTotalSeconds / 3600) % 24;
  const middleMinutes = Math.floor(middleTotalSeconds / 60) % 60;
  const midnight = new Date(maghrib);
  midnight.setHours(
    maghrib.getHours() + middleHours,
    maghrib.getMinutes() + middleMinutes
  );

  const hours = midnight.getHours();
  const minutes = midnight.getMinutes();

  timingDiv[0].children.item(0).textContent = hours;
  timingDiv[0].children.item(2).textContent = minutes;
}

main();
