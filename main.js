// execute a function right after the DOM is loaded
window.addEventListener('load', () => {
  let long; //longitude
  let lat; // latitude
  let description = document.querySelector('.description');
  let degree = document.querySelector('.degree');
  let timezone = document.querySelector('.timezone');
  let degreeArea = document.querySelector('.temperature');

  const iconID = document.querySelector('.icon');
  const tempUnit = document.querySelector('.degree-area span');

  // Browser will access the location of current user

  // If user allow location
  navigator.geolocation.getCurrentPosition(
    position => {
      // console.log(position) to see the postion object
      long = position.coords.longitude;
      lat = position.coords.latitude;

      /**
       * When we make a fetch request while running localhost,
       * it will be blocked by CORS policy of the browser.
       *
       * Usually, if we have a backend server, we can install CORS,
       * and everything will be fine, however, in this case, we are
       * running static files, so we will use a work-around, using
       * a Reverse Proxy API to help us by pass the blocking.
       *
       * What is Reverse Proxy?
       * => https://www.youtube.com/watch?v=Dgf9uBDX0-g
       */

      const proxy_cors = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy_cors}https://api.darksky.net/forecast/98cd5aa253f931dbac1c12fbb0dcc543/${lat},${long}`;

      fetch(api)
        .then(res => res.json())
        .then(data => {
          console.log(data); //to see returned data object
          const { temperature, summary, icon } = data.currently;
          // Set DOM elements
          degree.textContent = temperature;
          description.textContent = summary;
          timezone.textContent = data.timezone;

          // Invoke setIcon function
          setIcon(icon, iconID);

          // Change unit
          changeUnit(temperature);
        });
    },
    function(err) {
      if (err.code == err.PERMISSION_DENIED) {
        console.log('blocked');
        timezone.textContent = 'Turn on location';

        /**
         * TODO:
         * If location is block, switch to us Open Weather Map API
         */
      }
    }
  );

  // Get Icon function
  function setIcon(icon, iconID) {
    /**
     * Skycons if a set of icons made by Darksky
     * https://github.com/darkskyapp/skycons
     * clone or download it.
     * What we need is the skycon.js file in it
     */
    const skycons = new Skycons({ color: '#123456' });
    /**
     * icon that passed in from data.currently,
     * it will be in this-kind-of-format.
     * So we have to change the format,
     * because Skycons wants THIS_KIND_OF_FORMAT
     *
     * We will use global replacement
     * https://www.w3schools.com/jsref/jsref_replace.asp
     */
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }

  // Change Temperature Unit
  function changeUnit(temperature) {
    degreeArea.addEventListener('click', () => {
      if (tempUnit.textContent === 'F') {
        tempUnit.textContent = 'C';
        let celsius = (temperature - 32) * (5 / 9);
        degree.textContent = Math.floor(celsius);
      } else {
        tempUnit.textContent = 'F';
        degree.textContent = temperature;
      }
    });
  }
});
