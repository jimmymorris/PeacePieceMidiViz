const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
const { Midi } = require('@tonejs/midi')

const settings = {
  dimensions: 'A4',
  orientation: 'landscape',
  pixelsPerInch: 300,
  scaleToView: true,
  bleed: 1 / 8,
  p5: { p5 }
};

const sketch = async props => {

  const midiFile = await Midi.fromUrl('./midi/PeacePiece.mid')

  const {
    durationTicks: trackDurationTicks,
    duration: trackDuration,
    tracks
  } = midiFile;

  return ({ p5, context, exporting, bleed, width, height, trimWidth, trimHeight }) => {
    console.log(midiFile)

    if (!exporting && bleed > 0) {
      p5.stroke(0,0,255)
      p5.rect(bleed, bleed, trimWidth, trimHeight);
    }

    const track = midiFile.tracks[0];
    const sustain = track.controlChanges[64] !== undefined
      ? track.controlChanges[64]
      : [];
    const notes = track.notes;
    console.log({ sustain })

    console.log((trackDurationTicks / 8) / width)
    // p5.beginShape(p5.POINTS)
    p5.stroke(0);
    p5.strokeWeight(1)
    for (let i = 0; i < notes.length; i += 1) {
      const { name, durationTicks, midi, ticks } = notes[i]
      // console.log(notes[i])

      let w = p5.map(durationTicks, 0, trackDurationTicks, 0, width);
      let x = p5.map(ticks, 0, trackDurationTicks, 100, width - 100);
      let y = p5.map(midi, 0, 127, height - 100, 100)

      p5.rect(x, y, w, 8)
      // p5.vertex(x, y)
    }

    // p5.endShape()

  }

}

canvasSketch(sketch, settings);