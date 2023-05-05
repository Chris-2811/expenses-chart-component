const beams = document.querySelectorAll('.beam');
const beamCards = document.querySelectorAll('.beam-card')
const days = document.querySelectorAll('.day');

function highlightCurrentDay() {
    const date = new Date();
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).slice(0, 3).toLowerCase();
    console.log(dayOfWeek);

    beams.forEach(beam => {
        if(beam.getAttribute('data-day') === dayOfWeek) {
            beam.style.backgroundColor = '#B4E0E5'
        }
    })
}

async function getData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      return data
    } catch (error) {
      console.error(error);
    }
  }

async function showData(e) {
    const data = await getData();

    
    beamCards.forEach(beamCard => {
        const beamCardData = beamCard.getAttribute('data-beam');
        beamCard.style.display = 'none'
        const selectedData = data.find(item => item.day === beamCardData);
        beamCard.innerHTML = `$${selectedData.amount}`;
        
        if(e.target.getAttribute('data-day') === beamCardData) {
            beamCard.style.display = 'block'
        }

        adjustHeightOfBeams()
    })
}

async function adjustHeightOfBeams() {
    let data = await getData();

    const totalAmount = data.reduce((total, item) => {
        return total + item.amount
    },0 )

    const amounts = data.map(obj => obj.amount)

    const percentages = amounts.map((amount) => {
        const percentage = ((amount / totalAmount) * 100).toFixed(2);
        return percentage
    });
    
    
    
    beams.forEach((beam, index)=> {
        const percentage = percentages[index]
        const maxBeamHeight = '175';

        const height = `${Math.min(percentage, 100) * maxBeamHeight * 3.8 / 100}px`;
        beam.style.height = height;

    })

}

function highlightBeam(e) {
    console.log(e.target)

    beams.forEach(beam => {
        beam.classList.remove('active')
        e.target.classList.add('active')
    })

}



function addEventListeners() {
    beams.forEach(beam => {
        beam.addEventListener('click', showData);
        beam.addEventListener('mouseover', showData)
    });
    beams.forEach(beam => {
        beam.addEventListener('click', highlightBeam);
    });

    
    
    window.addEventListener('DOMContentLoaded', adjustHeightOfBeams)
}

function init() {
    showData();
    highlightCurrentDay();
    addEventListeners();
}

init()