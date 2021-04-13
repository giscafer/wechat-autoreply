var Typhoon = require('node-typhoon');

// get real-time information
Typhoon.typhoonActivity().then(data => {
    console.log(data);
	/**
	 [
          {
            "enname": "SARIKA",
            "lat": "13.90",
            "lng": "126.70",
            "movedirection": "西北西",
            "movespeed": "10",
            "name": "莎莉嘉",
            "power": "10",
            "pressure": "985",
            "radius10": null,
            "radius7": "200",
            "speed": "25",
            "strong": "强热带风暴",
            "tfid": "201621",
            "time": "2016-10-14 11:00:00",
            "timeformate": "10月14日11时"
          }
        ]
	 */
}).catch(err => {
    console.error(err)
});