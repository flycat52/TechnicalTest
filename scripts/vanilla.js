/**
 * Create by : Rayna Feng
 * Data: 13/07/2018
 * JS version : ES6 
 */
class WeatherController {
    constructor() {
        this._deltas = [];
    }

    /**
     * replace the original string with replacement string 
     * @param {string} original 
     * @param {string} regx 
     * @param {string} replacement 
     */
    replace(original, regx, replacement) {
        return original.replace(regx, replacement);
    }

    /**
     * sort array by object.Deltas element in acsending order
     * @param {object} a 
     * @param {object} b 
     */
    sortArray(a, b) {
        return a.Deltas > b.Deltas ? 1 : -1;
    }

    /**
     * assign deltas
     */
    dataTransform(lines) {
        for (let i = 2; i < lines.length; i++) { //start with the 3rd line
            const line = this.replace(lines[i].trim(), /\s+/g, ' ').split(' '); //replace tabs to single space
            const mxt = parseFloat(this.replace(line[1], /[^0-9. ]/g, '')); //MxT
            const mnt = parseFloat(this.replace(line[2], /[^0-9. ]/g, '')); //Mnt
            this._deltas.push({
                Dy: line[0],
                Deltas: Math.abs(mxt - mnt)
            });
        }
        this._deltas.sort(this.sortArray);
    }

    /**
     * return difference between MxT and MnT
     * @param {array} lines 
     */
    getDeltas(lines) {
        this.dataTransform(lines);
        return [this._deltas[0].Dy, this._deltas[this._deltas.length - 1].Dy];
    }
}

class FileController {
    constructor(view) {
        this._view = view;
    }

    /**
     * check whether file extension is dat 
     * @param {string} ext 
     */
    matchDatExtension(ext) {
        return /(dat)$/ig.test(ext);
    }

    /**
     * result of checking file type 
     * @param {object} file 
     */
    checkFileType(file) {
        return this.matchDatExtension(file.substr((file.lastIndexOf('.') + 1)));
    }

    /**
     * Bind change event for fileInput element
     */
    bindChangeEvent() {
        this._view.fileObject.addEventListener("change", this.fileChanged.bind(this));
    }

    /**
     * trigger file changed event
     */
    fileChanged() {
        const file = this._view.fileObject.files[0];
        if (this.checkFileType(file.name)) {
            const reader = new FileReader();
            reader.onload = () => this.displayResult(reader);
            reader.readAsText(file);
        } else {
            alert("File not supported!");
            this._view.minInnerText = '';
            this._view.maxInnerText = '';
        }
    }

    /**
     * display result in screen
     * @param {object} reader 
     */
    displayResult(reader) {
        const weathercontroller = new WeatherController();
        const result = weathercontroller.getDeltas(reader.result.split('\n'));
        this._view.minInnerText = result[0];
        this._view.maxInnerText = result[1];
    }
}

class View {
    constructor() {}

    /**
     * return HTML element min innerText
     */
    get minIntterText() {
        if (document.getElementById('min') == undefined) return undefined;
        return document.getElementById('min').innerText
    }

    /**
     * set value of HTML element min innerText
     */
    set minInnerText(val) {
        document.getElementById('min').innerText = val;
    }

    /**
     * return HTML element max innerText
     */
    get maxInnerText() {
        if (document.getElementById('max') == undefined) return undefined;
        return document.getElementById('max').innerText;
    }

    /**
     * set value of HTML element max innerText
     */
    set maxInnerText(val) {
        document.getElementById('max').innerText = val;
    }

    /**
     * return HTML element fileInput innerText
     */
    get fileObject() {
        if (document.getElementById('fileInput') == undefined) return undefined;
        return document.getElementById('fileInput');
    }
}

/**
 * client part
 */
(function main() {
    const view = new View();
    const filecontroller = new FileController(view);
    filecontroller.bindChangeEvent();
})()