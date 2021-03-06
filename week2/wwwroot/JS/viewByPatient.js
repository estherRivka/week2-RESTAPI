"use strict";

const patientControllerURL = "patient"
const columnNames = ["Start Date", "End Date", "City", "Location"];
const columnKeys = ["startDate", "endDate", "city", "location"];
let currentPatient = null;

window.onload = function () {
    configurePage(columnNames, columnKeys, patientControllerURL, currentPatient);
}

function getLocationsByPatientId(currentPatientId, url) {

    var xhttp = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState == 4 && this.status !== 200) {
                reject("an error accured retrieving data");
            }
        }
        xhttp.open("GET", `${url}/${currentPatientId}`);
        xhttp.send();
    });

};

function updatePatient(updatedPatient, url) {

    var xhttp = new XMLHttpRequest();

    return new Promise((resolve, reject) => {

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                resolve(JSON.parse(this.responseText));
            }
            if (this.readyState == 4 && this.status !== 200) {
                reject("an error accured updating");
            }
        }
        xhttp.open("PUT", url);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader('Accept', 'application/json');
        xhttp.send(JSON.stringify(updatedPatient))
    });

};



function configurePage(columnNames, columnKeys, patientURL, currentPatient) {

    const patientIdInp = document.getElementById("patientIdInp");
    let patientId;
    if (patientIdInp !== null) {
        patientIdInp.addEventListener("input", function () {
            patientId = parseInt(patientIdInp.value);
            if (isValidPatientId(patientId)) {
                SetViewLocationBtnAvailability(true);
            }
            else {
                SetViewLocationBtnAvailability(false);
            }
        });
    }

    const viewLocationTableBtn = document.getElementById("viewLocationTableBtn");

    if (viewLocationTableBtn !== null) {
        viewLocationTableBtn.addEventListener("click", async function () {
            currentPatient = await getLocationsByPatientId(patientId, patientURL);
            buildLocationTable(currentPatient, columnNames, columnKeys);
            SetViewLocationBtnAvailability(false);
        });
    }

    const addLocationBtn = document.getElementById("addLocationBtn");

    if (addLocationBtn !== null) {
        addLocationBtn.addEventListener("click", function () {
            addLocation(currentPatient, columnKeys);
        });
    }

    function SetViewLocationBtnAvailability(isValidPatientId) {

        if (isValidPatientId === false) {
            viewLocationTableBtn.disabled = true;
        }
        else {
            viewLocationTableBtn.disabled = false;
        }
    }

    function isValidPatientId(patientId) {

        if (Number.isInteger(patientId)) {
            return true;
        }
        else {
            alert("please enter valid patient Id");
            return false;
        }
    }

};



function buildLocationTable(currentPatient, columnNames, columnKeys) {

    const columnCount = columnNames.length;

    //Get 'add new location' inputs.
    const newLocationInputs = document.getElementsByClassName("addLocationInp");

    const table = document.createElement("TABLE");
    table.setAttribute("id", "locationsTable");
    table.border = "1";

    // Add the header row.
    const row = table.insertRow(-1);

    for (let i = 0; i < columnCount; i++) {
        const headerCell = document.createElement("TH");
        headerCell.dataset.id = i;
        headerCell.setAttribute("type", "text");
        headerCell.addEventListener("click", function () {
            sortLocationTableByColumn(currentPatient, columnNames, columnKeys, i);
        });
        headerCell.innerHTML = columnNames[i];
        row.appendChild(headerCell);

        newLocationInputs[i].value = '';
        newLocationInputs[i].setAttribute("placeholder", columnNames[i]);

    }

    //  Add the data rows.
    for (let i = 0; i < currentPatient.paths.length; i++) {
        addRowToTable(table, currentPatient.paths[i], currentPatient, columnKeys);
    }

    const tableDv = document.getElementById("tableDv");
    tableDv.innerHTML = "";
    tableDv.appendChild(table);

    //show add location option.
    document.getElementById("addLocationDv").style.display = "block";
}

function addRowToTable(table, newLocation, currentPatient, columnKeys) {

    const row = table.insertRow(-1);

    for (let key of columnKeys) {
        let cell = row.insertCell(-1);
        cell.innerHTML = newLocation[key];
    }

    const deleteCell = row.insertCell(-1);
    const deleteBtn = document.createElement("BUTTON");   // Create a <button> element
    deleteBtn.innerHTML = "Delete";
    deleteBtn.addEventListener("click", function () {
        deleteLocation(currentPatient, row);
    });
    deleteCell.appendChild(deleteBtn);

}

function sortLocationTableByColumn(currentPatient, columnNames, columnKeys, columnIndex) {

    const sortByKey = columnKeys[columnIndex];
    currentPatient.paths.sort((a, b) => a[sortByKey].localeCompare(b[sortByKey]));

    buildLocationTable(currentPatient, columnNames, columnKeys);
}

async function addLocation(currentPatient, columnKeys) {

    const startDateInp = document.getElementById("startDateInp");
    const endDateInp = document.getElementById("endDateInp");
    const cityInp = document.getElementById("cityInp");
    const locationInp = document.getElementById("locationInp");

    function checkDetailsValid() {
        if (startDateInp === null || endDateInp === null || cityInp === null || locationInp === null) {
            return false;
        }
        if (startDateInp.value === "" || endDateInp.value === "" || cityInp.value === "" || locationInp.value === "") {
            alert("invalid details");
            return false;
        }
        if ((Date.parse(startDateInp.value) >= Date.parse(endDateInp.value))) {
            alert("End date should be greater than Start date");
            endDateInp.value = "";
            return false;
        }
        else {
            return true;
        }

    }
    if (checkDetailsValid() === false) {
        return;
    }
    else {
        const newLocation = {
            startDate: (((startDateInp.valueAsDate.getMonth() > 8) ? (startDateInp.valueAsDate.getMonth() + 1) : ('0' + (startDateInp.valueAsDate.getMonth() + 1))) + '/' + ((startDateInp.valueAsDate.getDate() > 9) ? startDateInp.valueAsDate.getDate() : ('0' + startDateInp.valueAsDate.getDate())) + '/' + startDateInp.valueAsDate.getFullYear()),
            endDate: (((endDateInp.valueAsDate.getMonth() > 8) ? (endDateInp.valueAsDate.getMonth() + 1) : ('0' + (endDateInp.valueAsDate.getMonth() + 1))) + '/' + ((endDateInp.valueAsDate.getDate() > 9) ? endDateInp.valueAsDate.getDate() : ('0' + endDateInp.valueAsDate.getDate())) + '/' + endDateInp.valueAsDate.getFullYear()),
            city: cityInp.value,
            location: locationInp.value
        };


        const locationsTable = document.getElementById("locationsTable");
        addRowToTable(locationsTable, newLocation, currentPatient, columnKeys);

        currentPatient.paths.push(newLocation);
        const response = await updatePatient(currentPatient, "patient");
        console.log(response);


    }

}

function deleteLocation(currentPatient, rowToDelete) {

    //Get all rows from table as array.
    const tableBody = rowToDelete.parentNode;
    const allRows = Array.prototype.slice.call(tableBody.children);

    const index = allRows.indexOf(rowToDelete);
    tableBody.removeChild(rowToDelete);

    currentPatient.paths.splice(index - 1, 1);

    updatePatient(currentPatient, "patient");

}



