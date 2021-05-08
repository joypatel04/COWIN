const axios = require("axios");

let count = 0;

setInterval(async function () {
  console.log("RUNNING");

  try {
    const response = await axios.get(
      "https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=776&date=10-05-2021",
      {
        headers: {
          "access-control-allow-headers": "Content-Type",
          "content-type": "application/json",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
        },
      }
    );

    count++;
    console.log("TIME & DATE", new Date(), count);

    if (response.data) {
      const {
        data: { centers },
      } = response;
      if (centers) {
        const findCentersWithAvaiablity = centers.filter((item) => {
          const session = item.sessions.find(
            (session) =>
              session.available_capacity > 0 && session.min_age_limit === 18
          );
          if (session) {
            return item;
          }
        });

        if (findCentersWithAvaiablity) {
          setTimeout(() => {
            findCentersWithAvaiablity.forEach(async (data) => {
              var dataSession = data.sessions[0];
              var payload = {
                username: "COWIN",
                color: 15258703,
                embeds: [
                  {
                    fields: [
                      {
                        name: "**Center name:**",
                        value: `${data.name}`,
                      },
                      {
                        name: "**Address:**",
                        value: `${data.address}`,
                      },
                      {
                        name: "**Pincode:**",
                        value: `${data.pincode}`,
                        inline: true,
                      },
                      {
                        name: "**Avaiable capacity:**",
                        value: `${dataSession.available_capacity}`,
                        inline: true,
                      },
                      {
                        name: "**Vaccine:**",
                        value: `${dataSession.vaccine}`,
                        inline: true,
                      },
                      {
                        name: "**Fee type::**",
                        value: `${data.fee_type}`,
                        inline: true,
                      },
                    ],
                  },
                ],
              };

              try {
                await axios.post(
                  "https://discord.com/api/webhooks/839706352443195412/7fQGMhC5cgyLrAMyzf6sz4bXvyR5xIrUrgR3hTmyuhuoUec_gUR1Pn4QB29WkGPEvHHm",
                  payload
                );
              } catch (e) {
                console.log("Error Sending to Webhook", e);
              }
            });
          }, 1000);
        }
      }
    }
  } catch (e) {
    console.log("Error", e);
  }
}, 20000);
