var svg = d3.select('svg');

function scale(scaleFactor) {
  return d3.geoTransform({
    point: function (x, y) {
      this.stream.point(x * scaleFactor, y * scaleFactor);
    },
  });
}

var path = d3.geoPath().projection(scale(0.12));

d3.json('https://d3js.org/us-10m.v1.json', function (error, us) {
  if (error) throw error;

  svg
    .append('g')
    .attr('class', 'states')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.states).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', function (d, i) {
      if (data.includes(parseInt(d.id)) || data[0] == '0') {
        return '#0094c5';
      } else {
        return 'none';
      }
    })
    .attr('stroke', 'black')
    .attr('stroke-width', '0.3px');
}).then(() => {
  window.status = 'ready';
});
