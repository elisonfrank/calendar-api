This API provides information about the month.

You need to insert a month and year in the URL.

The API will return a JSON like the example below:

###### Presentation of the first day of June 2020
```
  URL: http://localhost:3000/calendar?month=6&year=2020
  JSON:
  {
    "date": "2020-06-01T03:00:00.000Z"
    "info": {
      "dayOfWeek": 1,
      "fullDayOfWeek": monday,
      "holiday": false,
      "note": "",
      "enabled": true,
    }
  } 
```

If the day is a holiday, extra information will be displayed on the "holiday" property, as below (Brazilian holidays only):
```
  ...
  "holiday": {
    "date":"yyyy-mm-dd 00:00:00",
    "start":"yyyy-mm-ddT00:00:00.000Z",
    "end":"yyyy-mm-ddT00:00:00.000Z",
    "name":"holiday's name",
    "type":"public"
  },
  ...
```

The **"note"** property is for showing notes added on the date. (under construction)

The **"enabled"** property is to identify whether the day belongs to the month. To fill all calendar days, other days are shown.
