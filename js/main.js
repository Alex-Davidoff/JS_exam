function NVCreate(){
    return ({
        namesvalues : {},
        showarray : [],
        sorting : '',
        showInSelect : function (select_id, sort){
            let select_c = document.getElementById(select_id);
            select_c.replaceChildren();
            this.showarray = [];
            if (sort) {this.sorting = sort}
            for (const tprop in this.namesvalues){
                const titem = {name: tprop, value: this.namesvalues[tprop]};
                this.showarray.push(titem);
            }
            if (this.showarray.length>0){
                if (this.sorting === 'byname'){
                    this.showarray.sort((a, b) => a.name.localeCompare(b.name))
                } else if (this.sorting === 'byvalue'){
                    this.showarray.sort((a, b) => a.value.localeCompare(b.value))
                }
                for (const item of this.showarray){
                    let item_c = document.createElement('option');
                    select_c.appendChild(item_c);
                    item_c.innerText = `${item.name}=${item.value}`;
                }
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
                const tname = splval[0].trim(), tval = splval[1].trim();
                if ((tname) && (tval)){
                    this.namesvalues[tname] = tval;
                }
            }
        },
        deleteSelected : function (select_id){
            const select_c = document.getElementById(select_id);
            const selOptions = select_c.selectedOptions;
            if (selOptions.length>0){
                for (let c=0; c<selOptions.length; c++){
                    const selindex= selOptions[c].index;
                    delete this.namesvalues[this.showarray[selindex].name];
                }
            }
            
        }
})
}    

////////////////

document.getElementById('testpanels').addEventListener('submit', function (event) {
    event.preventDefault(); 
});

let nvstor = new NVCreate();
nvstor.namesvalues["Vasia"] = 'happy';
nvstor.namesvalues["Petya Pupkin"] = 'unhappy';
nvstor.namesvalues["Nastya"] = 'little sad';
nvstor.namesvalues["Alex"] = 'calm';
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

//add regexp check, load-save-clear, input from/output to object