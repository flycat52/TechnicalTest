/**
 * Create by : Rayna Feng
 * Data: 13/07/2018
 * JS version : ES6 
 */

window.onload = () => {
    let min = document.getElementById('min');
    let max = document.getElementById('max');
    let fileInput = document.getElementById('fileInput');

    /**
     * reset labels  
     * @param {string} - minimum difference 
     * @param {string} - maximum difference
     */
    let init = (min, max) => {
        min.innerText = '';
        max.innerText = '';
    }

    init(min, max);

    /**
     * check whether file extension is dat 
     * @param {string} ext 
     */
    let matchDatExtension = ext => {
        return /(dat)$/ig.test(ext);
    }

    /**
     * result of checking file type 
     * @param {object} file 
     */
    let checkFileType = file => {
        let ext = file.name.substr((file.name.lastIndexOf('.') + 1));
        return matchDatExtension(ext);
    }

    /**
     * replace the original string with replacement string 
     * @param {string} original 
     * @param {string} regx 
     * @param {string} replacement 
     */
    let replace = (original, regx, replacement) => {
        return original.replace(regx, replacement);
    }

    /**
     * sort array by object.Diff element in acsending order
     * @param {object} a 
     * @param {object} b 
     */
    let sortArray = (a, b) => {
        return a.Diff > b.Diff ? 1 : -1;
    }

    /**
     * event trigerred when file is changed
     */
    let fileChanged = () => {
        init(min, max);

        let file = fileInput.files[0]; //single file

        if (checkFileType(file)) {
            let reader = new FileReader();

            reader.onload = () => {
                let content = reader.result;
                let lines = content.split('\n');

                let diff = [];

                for (let i = 2; i < lines.length; i++) { //start with the 3rd line
                    let line = replace(lines[i].trim(), /\s+/g, ' ').split(' '); //replace tabs to single space

                    let mxt = parseFloat(replace(line[1], /[^0-9. ]/g, '')); //MxT
                    let mnt = parseFloat(replace(line[2], /[^0-9. ]/g, '')); //Mnt

                    diff.push({ Dy: line[0], Diff: Math.abs(mxt - mnt) });
                }

                diff.sort(sortArray);
                min.innerText = diff[0].Dy;
                max.innerText = diff[diff.length - 1].Dy;
            }

            reader.readAsText(file);
        } else {
            alert("File not supported!");
        }
    }

    fileInput.addEventListener("change", fileChanged);
};