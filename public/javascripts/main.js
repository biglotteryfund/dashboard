(function () {
  const pagespeedApiUrl =
    'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?';
  let pagespeedTests = [
    {
      url: 'https://www.biglotteryfund.org.uk',
      title: 'New site',
      elm: document.getElementById('js-perf-new')
    }
  ];

  function formatBytes(a, b) {
    if (0 === a) {
      return '0 Bytes';
    }
    let c = 1e3,
      d = b || 2,
      e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
  }

  // via https://stackoverflow.com/a/17268489
  function getColor(value) {
    //value from 0 to 1
    let hue = ((1 - value) * 120).toString(10);
    return ['hsl(', hue, ',100%,50%)'].join('');
  }

  let makePerfStats = (test, data) => {
    let s = data.pageStats;
    let bytes = [
      s.htmlResponseBytes,
      s.textResponseBytes,
      s.cssResponseBytes,
      s.imageResponseBytes,
      s.javascriptResponseBytes,
      s.flashResponseBytes,
      s.otherResponseBytes
    ];
    bytes = bytes.map(b => parseInt(b) || 0);
    let totalBytes = bytes.reduce((a, b) => a + b, 0);

    test.elm.style.borderTopColor = getColor(parseInt(data.ruleGroups.SPEED.score) / 100);

    let str = '';
    str += '<div class="row"><div class="col-sm-4 text-center">';
    str += `<h4>${
      data.ruleGroups.SPEED.score
      } / 100</h4> pagespeed score`;
    str += '</div><div class="col-sm-4 text-center">';
    str += `<h4>${
      data.pageStats.numberResources
      }</h4> Resources`;
    str += '</div><div class="col-sm-4 text-center">';
    str += `<h4>${formatBytes(
      totalBytes
    )}</h4> Page weight`;
    str += '</div></div>';
    return str;
  };

  window.Dashboard = {
    init({ pagespeedKey }) {
      pagespeedTests.forEach(test => {
        // get pagespeed data
        let query = ['url=' + test.url, 'key=' + pagespeedKey].join('&');
        let url = pagespeedApiUrl + query;
        fetch(url)
          .then(r => r.json())
          .then(j => {
            test.elm.innerHTML = makePerfStats(test, j);
          });
      });
    }
  };
}());
