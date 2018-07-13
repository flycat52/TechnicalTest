/**
 * Create by : Rayna Feng
 * Data: 13/07/2018
 * JS version : ES6 
 */

window.onload = () => {
    let min = document.getElementById('min');
    let max = document.getElementById('max');
    let fileInput = document.getElementById('fileInput');

    let init = (min, max) => {
        min.innerText = '';
        max.innerText = '';
    }

    let matchDatExtension = ext => {
        return /(dat)$/ig.test(ext);
    }

    let checkFileType = file => {
        let ext = file.name.substr((file.name.lastIndexOf('.') + 1));
        return matchDatExtension(ext);
    }

    let replace = (original, regx, replacement) => {
        return original.replace(regx, replacement);
    }

    // let removeSpecialCharacters = obj => {
    //     return obj.replace(/[^0-9. ]/g, "")
    // }

    let sortArray = (a, b) => {
        return a.Diff > b.Diff ? 1 : -1;
    }

    init(min, max);

    fileInput.addEventListener("change", () => {
        init(min, max);

        let file = fileInput.files[0]; //single file

        if (checkFileType(file)) { //check file type
            let reader = new FileReader();

            reader.onload = () => {
                let content = reader.result;
                let lines = content.split('\n');

                let diff = [];

                for (let i = 2; i < lines.length; i++) { //start with the 3rd line
                    let line = replace(lines[i].trim(), /\s+/g, ' ').split(' '); //replace tabs to single space

                    let mxt = parseFloat(replace(line[1], /[^0-9. ]/g, '')); //line[1]: MxT
                    let mnt = parseFloat(replace(line[2], /[^0-9. ]/g, '')); //line[2]: Mnt

                    diff.push({ Dy: line[0], Diff: Math.abs(mxt - mnt) }); //line[0]: Dy
                }

                diff.sort(sortArray); // in ascending order
                min.innerText = diff[0].Dy;
                max.innerText = diff[diff.length - 1].Dy;
            }

            reader.readAsText(file);
        } else {
            alert("File not supported!");
        }
    });
};