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
        }
})
}    

////////////////

document.getElementById('testpanels').addEventListener('submit', function (event) {
    event.preventDefault(); 
});

let nvstor = new NVCreate();
nvstor.showInSelect('list');

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

let input_c = document.getElementById('inp');
input_c.addEventListener('input', () => {
    input_c.value = input_c.value.replace(/[^a-zA-Z0-9=\s]/g, '');
});

const select_c = document.getElementById('list');
select_c.onchange = function (){
    const selOptions = select_c.selectedOptions;
        if (selOptions.length>0){
            input_c.value = `${nvstor.nvarray[selOptions[selOptions.length-1].index].name}=${nvstor.nvarray[selOptions[selOptions.length-1].index].value}`;
        }
}

document.getElementById('btn_addtest').onclick = function(){
    nvstor.add('Vasia','Pupkin');
    nvstor.add('Petya','Piatochkin');
    nvstor.add('Anya','Koval Moloda');
    nvstor.importFromArr([{name:'Alex', value:'Davidoff'}, {name: 'Vitaliy', value:'Student 4 cource'}]);
    nvstor.showInSelect('list');
}

document.getElementById('btn_save').onclick = function(){
    localStorage.setItem('nvstor',JSON.stringify(nvstor.exportToArr()));
}

document.getElementById('btn_load').onclick = function(){
    nvstor.importFromArr(JSON.parse(localStorage.getItem('nvstor')));
    nvstor.showInSelect('list');
}

document.getElementById('btn_clstor').onclick = function(){
    localStorage.removeItem('nvstor');
}