/* README
NVCreate : function which create storage and methods for access to array of names and values. returns object which contain:
nvarray : work array of objects. Format {name:'string', value:'string'}

sorting : variable which save sorting variant. Used in function 'showInSelect'.

showInSelect(select_id, sort) : function which add to choosen <select> <option>'s, which contain values of array. Format name=value. Arguments:
    - select_id = contain id of choosen <select>. String. Required argument.
    - sort = argument which define sorting algorinm. String. Not required argument. Can contain:
        '' = without sorting
        'byname' = work array will be shown sorted by object property 'name' ascending;
        'byvalue' = work array will be shown sorted by object property 'value' ascending;

add(addname, addvalue) : function push to nvarray new object, which have structure {name:'<addname>', value: '<addvalue>'}. Arguments will be trimmed, not alpha-numeric characters deleted. If work array object contain <name> which equivalent addname, <value> of this object will be replaced to addvalue. Arguments:
    - addname, addvalue = String. Required argument. Can't be Null.

addFromInput(input_id) : push to work array value of choosen <input>. Value must contain only one equivalent-symbol. Transmit splitted value to function 'add'. Arguments:
    - input_id = String. Required. Can't be Null. Property 'id' of choosen <input>.

deleteSelected(select_id) : delete selected items from work array. Marked items reads from <select>, where work array shown. Arguments:
    - select_id = String. Required. Can't be Null. Property 'id' of choosen <select>.

importFromArr(arr) : push to work array new objects, contains in 'arr'. Use to load work array from storage or massive adding new items from another array. Structure of objects in array must be equivalent structure of objects in work array (see nvarray). Arguments:
    - arr = Array of objects. Required. Can't be Null.

exportToArr() : returns work array. Use to save work array or transfer.

getByName(getName) : returns <value> of object, if 'getName' equivalent <name> of object which contains in work array. Arguments:
    - getName = String. Required. Can't be Null.
*/

function NVCreate(){
    return ({
        nvarray : [],
        sorting : '',
        showInSelect : function (select_id, sort){
            let select_c = document.getElementById(select_id);
            select_c.replaceChildren();
            if (sort) {this.sorting = sort}
            if (this.nvarray.length>0){
                if (this.sorting === 'byname'){
                    this.nvarray.sort((a, b) => a.name.localeCompare(b.name))
                } else if (this.sorting === 'byvalue'){
                    this.nvarray.sort((a, b) => a.value.localeCompare(b.value))
                }
                for (const item of this.nvarray){
                    let item_c = document.createElement('option');
                    select_c.appendChild(item_c);
                    item_c.innerText = `${item.name}=${item.value}`;
                }
            }
        },
        add : function (addname, addvalue){
            let tname = addname.trim().replace(/[^a-zA-Z0-9=\s]/g, '');
            let tvalue = addvalue.trim().replace(/[^a-zA-Z0-9=\s]/g, '');
            let findIndex = this.nvarray.findIndex((val) => val.name === tname);
            if (findIndex===-1){
                this.nvarray.push({
                name: tname,
                value: tvalue });
            } else {
                this.nvarray[findIndex].value = tvalue;
            }
        },
        addFromInput : function (input_id){
            const eqSign = "=";
            function eqCount(tstr){
                let c = 0;
                if (tstr){
                for (const tchar of tstr){
                    if (tchar === eqSign){ c++ };
                }}
                return c;
            }
            const input_c = document.getElementById(input_id);
            const input_value = input_c.value;
            if ((input_value) && (eqCount(input_value) === 1)){
                const splval = input_value.split(eqSign);
                const tname = splval[0], tval = splval[1];
                if ((tname) && (tval)){
                    this.add(tname,tval);
                }
            }
        },
        deleteSelected : function (select_id){
            const select_c = document.getElementById(select_id);
            const selOptions = select_c.selectedOptions;
            if (selOptions.length>0){
                for (let c=0; c<selOptions.length; c++){
                    const selindex= selOptions[c].index;
                    this.nvarray[selindex].name = '';
                }
                this.nvarray = this.nvarray.filter((value) => (value.name))
            }
        },
        importFromArr : function (arr){
            if (arr){
                for (const item of arr){
                    this.add(item.name,item.value);
                }
            }
        },
        exportToArr : function(){
            return this.nvarray;
        },
        getByName : function (getName){
            const tmp1 = this.nvarray.filter((value) => (value.name === getName));
            if (tmp1){
                return tmp1[0].value;
            }
        }
})
}    

////////////////

let nvstor = new NVCreate();  // creating work object by constructor function

//set onclick functions for buttons 'Add', 'Delete', 'Sort by Name', 'Sort by Value'
document.getElementById('btn_add').onclick = function(){  
    nvstor.addFromInput('inp');
    nvstor.showInSelect('list');
}

document.getElementById('btn_del').onclick = function(){
    nvstor.deleteSelected('list');
    nvstor.showInSelect('list');
}

document.getElementById('btn_sortbname').onclick = function(){
    nvstor.showInSelect('list', 'byname');
}

document.getElementById('btn_sortbvalue').onclick = function(){
    nvstor.showInSelect('list', 'byvalue');
}

/////////////////

// add input-filter to <input>
let input_c = document.getElementById('inp');
input_c.addEventListener('input', () => {
    input_c.value = input_c.value.replace(/[^a-zA-Z0-9=\s]/g, '');
});

// set value of <input> which equivalent last selected item in <select>
const select_c = document.getElementById('list');
select_c.onchange = function (){
    const selOptions = select_c.selectedOptions;
        if (selOptions.length>0){
            const tname = nvstor.nvarray[selOptions[selOptions.length-1].index].name;
            input_c.value = `${tname}=${nvstor.getByName(tname)}`;
        }
}

/////////////////

// add test data to work array
document.getElementById('btn_addtest').onclick = function(){
    nvstor.add('Vasia','Pupkin');
    nvstor.add('Petya','Piatochkin');
    nvstor.add('Anya','Koval');
    nvstor.importFromArr([{name:'Alex', value:'Zaharchenko'}, {name: 'Vitaliy', value:'Student 4 cource'}]);
    nvstor.showInSelect('list');
}
// test save to LocalStorage
document.getElementById('btn_save').onclick = function(){
    localStorage.setItem('nvstor',JSON.stringify(nvstor.exportToArr()));
}
// test load from LocalStorage
document.getElementById('btn_load').onclick = function(){
    nvstor.importFromArr(JSON.parse(localStorage.getItem('nvstor')));
    nvstor.showInSelect('list');
}
// clear LocalStorage
document.getElementById('btn_clstor').onclick = function(){
    localStorage.removeItem('nvstor');
}