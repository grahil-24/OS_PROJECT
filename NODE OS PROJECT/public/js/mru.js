import { validate } from './validator.js';

const addReferenceBtn = document.getElementById('addTrackBtn');
const executeBtn = document.getElementById('executeButton');
const framesTextBox = document.getElementById('NoofFrames');
const pageNumberTextBox = document.getElementById('PageNo');
let frames = 0;
let numOfRequests = 0;
let requestedPages = [];
let count = 0;
let index;      //to store the array index, where a page hit or miss was detected

addReferenceBtn.addEventListener('click', () => {

    if (validate(parseInt(framesTextBox.value), parseInt(pageNumberTextBox.value))) {
        //getting the number of frames in the main memory from the user
        frames = parseInt(framesTextBox.value);
        //page number requested by the CPU
        requestedPages.push(parseInt(pageNumberTextBox.value));
        // console.log(pageNumberTextBox.value);
        //number of pages requested by the CPU
        numOfRequests++;
    }
    pageNumberTextBox.value = '';
});


executeBtn.addEventListener('click', () => {
    let outputTable = document.getElementById('outputtable');
    let totalHitsTextBox = document.getElementById('numofhits');
    let totalMissTextBox = document.getElementById('numofmiss');
    let hitRatio = document.getElementById('hitratio');
    let missRatio = document.getElementById('missratio');

    let numOfHits = 0;      //to indicate the number of page hits
    let numOfMiss = 0;      //to indicate the number of page miss
    let arr = new Array(frames);    //memory
    let mostRecentlyUsed = 0;      //index of the mru page in the memory
    let j = 0;
    let numOfEle = 0;       //indicates the number of pages present currently in memory
    //to indicate page hit or miss. miss = false means a page hit or else a page miss
    let miss = false;
    let pageFound = false;

    //-------IMPLEMENTATION OF MRU PAGE REPLACEMENT ALGO---------//
    for (let i = 0; i < numOfRequests; i++) {
        const requestedPage = requestedPages[i];
        //initially when the frames are empty. the requested page is stored in memory and 
        //is considered a page miss
        if (numOfEle == 0) {
            arr[0] = requestedPage;
            numOfEle++;
            numOfMiss++;
            miss = true;
            index = 0;
        } else {
            for (j = 0; j < numOfEle; j++) {
                //if requested page is already present in memory. A page hit
                if (requestedPage == arr[j]) {
                    pageFound = true;
                    miss = false;
                    break;
                }
            }
            if (miss == false) {
                numOfHits++;
                mostRecentlyUsed = j;
                pageFound = false;
                index = j;
                //if some frames are empty. the requested pages if absent take up the free space
                //insted of replacing the recently used page. Also a page miss
            } else if (numOfEle < frames) {
                arr[numOfEle] = requestedPage;
                numOfEle++;
                numOfMiss++;
                mostRecentlyUsed = numOfEle - 1;
                index = mostRecentlyUsed;
                //memory is not empty and requested page is not found in the memory. It replaces
                //the most recently used page in the memory. Considered a page miss
            } else {
                arr[mostRecentlyUsed] = requestedPage;
                numOfMiss++;
                index = mostRecentlyUsed;
            }
        }
        OutputTable(outputTable, arr, miss, index);
        miss = true;
    }
    totalHitsTextBox.value = numOfHits;
    totalMissTextBox.value = numOfMiss;
    hitRatio.value = parseFloat((numOfHits / numOfRequests) * 100).toFixed(4);
    missRatio.value = parseFloat((numOfMiss / numOfRequests) * 100).toFixed(4);
});


//creating the output table
const OutputTable = (OutputTable, arr, miss, index) => {
    let row;
    let td;
    let text;
    for (let i = 0; i < arr.length; i++) {
        //count is for number of columns in the table
        if (count == 0) {
            //initially when the table is empty we have to create rows equal to number of frames
            row = document.createElement('tr');
            //creating cells
            td = document.createElement('td');

            //empty array indexes are undefined
            if (typeof arr[i] == 'undefined') {
                text = document.createTextNode('');
            } else {
                text = document.createTextNode(arr[i]);
            }
            //inserting the page number into the cell
            td.appendChild(text);
            //appending the cell to the row
            row.appendChild(td);
            //appending the cell to the table
            OutputTable.appendChild(row);
        } else {
            //rows were already created. so we just have to fetch them
            row = OutputTable.getElementsByTagName("tr")[i];
            //creating cells
            td = document.createElement('td');
            if (typeof arr[i] == 'undefined') {
                text = document.createTextNode('');
            } else {
                text = document.createTextNode(arr[i]);
            }
            td.appendChild(text);
            //appending the cell to the row
            row.appendChild(td);
        }
    }
    //coloring the cell depending upon page hit or page miss. 
    //page hit is denoted by green and page miss by red color.
    if (miss == true) {
        let cell = OutputTable.rows[index].cells[count];
        cell.style.backgroundColor = "red";
    } else {
        let cell = OutputTable.rows[index].cells[count];
        cell.style.backgroundColor = "green";
    }
    count++;
}
