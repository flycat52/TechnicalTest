/**
 * Create by : Rayna Feng
 * Data: 13/07/2018
 * JS version : ES6 
 */
class Weather {
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
            let line = this.replace(lines[i].trim(), /\s+/g, ' ').split(' '); //replace tabs to single space

            let mxt = parseFloat(this.replace(line[1], /[^0-9. ]/g, '')); //MxT
            let mnt = parseFloat(this.replace(line[2], /[^0-9. ]/g, '')); //Mnt

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

class ReadFile {
    constructor() {}

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
        document.getElementById('fileInput').addEventListener("change", this.fileChanged.bind(this));
    }

    /**
     * trigger file changed event
     */
    fileChanged() {
        let file = document.getElementById('fileInput').files[0]; //single file

        if (this.checkFileType(file.name)) {
            let reader = new FileReader();
            reader.onload = () => {
                const w = new Weather();

                let content = reader.result;
                let lines = content.split('\n');
                let result = w.getDeltas(lines);

                document.getElementById('min').innerText = result[0];
                document.getElementById('max').innerText = result[1];
            }
            reader.readAsText(file);
        } else {
            alert("File not supported!");
            document.getElementById('min').innerText = '';
            document.getElementById('max').innerText = '';
        }
    }
}

/**
 * client part
 */
(function main() {
    const f = new ReadFile();
    f.bindChangeEvent();
})()