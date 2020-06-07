const canvasSketch = require('canvas-sketch');
const { pathsToSVG } = require('canvas-sketch-util/penplot');
const math = require('canvas-sketch-util/math');
const { Midi } = require('@tonejs/midi')

const lines = [];

const settings = {
  dimensions: 'A4',
  orientation: 'landscape',
  pixelsPerInch: 300,
  scaleToView: true,
  units: 'cm',
  bleed: 0.25
};

// function to generate a random number between min and max
const random = (min, max) => Math.random() * (max - min) + min;

const sketch = async context => {
  const midiFile = await Midi.fromUrl('./midi/PeacePiece.mid')
  const {
    durationTicks: trackDurationTicks,
    duration: trackDuration,
    tracks
  } = midiFile;



  return ({ bleed, context, width, height, units }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const track = midiFile.tracks[0];
    const notes = track.notes;

    for (let i = 0; i < notes.length; i += 1) {
    // for (let i = 0; i < 5; i += 1) {
      const { name, durationTicks, midi, ticks } = notes[i]

      const w = math.mapRange(durationTicks, 0, trackDurationTicks, 0, width - bleed);
      const x = math.mapRange(ticks, 0, trackDurationTicks, bleed, width - bleed);
      const y = math.mapRange(midi, 0, 127, height - bleed, bleed);

      drawSquare({
        context,
        cx: x,
        cy: y,
        width: w,
        height: 0.15,
      })
    }

    return [
      context.canvas,
      {
        data: pathsToSVG(lines, {
          width,
          height,
          units
        }),
        extension: '.svg'
      }
    ];
  };

  // rotate [x,y] around the center [cx, cy] with angle in degrees
  // and y-axis moving downward
  // draw a square in a single line
  // and rotate it if needed
  function drawSquare({context, cx, cy, width, height}) {
    // calculate rotated coordinates
    let xy1 = [cx, cy];
    let xy2 = [cx + width, cy];
    let xy3 = [cx + width, cy + height];
    let xy4 = [cx, cy + height];


    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 0.02;
    context.lineCap = 'square';
    context.lineJoin = 'miter';

    // draw square on context
    context.moveTo(...xy1);
    context.lineTo(...xy2);
    context.lineTo(...xy3);
    context.lineTo(...xy4);
    context.lineTo(...xy1);
    // context.rect(cx, cy, width, height)
    context.stroke();

    // draw square for svg polylines
    lines.push([xy1, xy2]);
    lines.push([xy2, xy3]);
    lines.push([xy3, xy4]);
    lines.push([xy4, xy1]);
  }
};

canvasSketch(sketch, settings);