function url(wod) {
  if (wod) {
    var id = wod.id;
    if (wod.name) { id += "-" + clean(wod.name); }
    location.hash = "#" + encodeURIComponent(id);
  } else {
    return decodeURIComponent(location.hash.slice(1)).split("-")[0];
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function clean(string) {
  return $.trim(string).toLowerCase();
}

function drawTags(tag) {
  var label = {
    "wallball": "success",
    "barbell": "primary",
    "dumbbell": "primary",
    "kettlebell": "info",
    "rings": "warning",
    "pullup": "danger"
  }[tag] || "default";

  return "<span class='label label-" + label + "'>" + clean(tag) + "</span>";
}

function drawExercises(exercise) {
  var name   = clean(exercise.name),
      reps   = clean(exercise.reps),
      weight = clean(exercise.weight);

  var description = "<li class='list-group-item'>" +
    "<b>" + reps + "</b> " + name;

  if (weight) {
    description += " <i>(<abbr title='weight or height'>" +
      weight +
    "</abbr>)</i>";
  }

  description += "</li>";

  return description;
}

function show(name, wod) {
  var html   = [],
      items  = wod[name],
      drawFn = "draw" + capitalize(name);

  if (!(items instanceof Array)) { items = [ items ]; }

  for (var i=0; i<items.length; i++) {
    html.push(
      (typeof(window[drawFn]) === "function") ?
      window[drawFn](items[i]) : clean(items[i])
    );
  }

  $("#" + name).html(html.join("\n"));
}

function random(wods) {
  return wods[Math.floor(Math.random() * wods.length)];
}

function fromUrl(wods) {
  if (!url()) { return; }

  for (var i=0; i<wods.length; i++) {
    if (clean(wods[i].id) == url()) {
      return wods[i];
    }
  }
}

$.getJSON("wods.json", function (json) {
  var wod = fromUrl(json.wods) || random(json.wods);

  url(wod);

  show("name", wod);
  show("description", wod);
  show("tags", wod);
  show("exercises", wod);
});
