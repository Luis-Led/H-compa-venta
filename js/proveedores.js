var proveedores=JSON.parse(localStorage.getItem("proveedores")) || [];
var seleccionado=null;
// setearDatos();  funciona aqui cuando se trabaja con function no con funcion flecha
const registrarProveedor=()=>{
    var empresa=document.getElementById("empresa").value;
    var contacto=document.getElementById("contacto").value;
    var telefono=document.getElementById("telefono").value;
    var correo=document.getElementById("correo").value;
    var direccion=document.getElementById("direccion").value;
    
    if(empresa=="" || contacto=="" || telefono=="" || correo=="" || direccion==""){
        Swal.fire({
            icon: 'warning',
            title: 'Faltan Datos!',
            text: 'Por favor rellene todos los campos del formulario !!!'
        });
        return;
    }
    var proveedor={
        empresa:empresa,
        contacto:contacto,
        telefono:telefono,
        correo:correo,
        direccion:direccion
    }
    if(seleccionado!=null){
        proveedores[seleccionado]=proveedor;
        // localStorage.removeItem("proveedor_seleccionado");
    }else{
        proveedores.push(proveedor);
    }

    localStorage.setItem("proveedores",JSON.stringify(proveedores));

    window.location.href='proveedores.html';
}

const cargarDatos=()=>{
    var cadena="";
    for(var i=0;i<proveedores.length;i++){
        cadena+=`
        <tr>
            <td>${i+1}</td>
            <td>${proveedores[i].empresa}</td>
            <td>${proveedores[i].contacto}</td>
            <td>${proveedores[i].telefono}</td>
            <td>${proveedores[i].direccion}</td>
            <td>${proveedores[i].correo}</td>
            <td>
                <div class="acciones">
                    <button onclick="editarProveedor(${i})" href="" class="btn btn-edit m5">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button href="" onclick="eliminarProveedor(${i})" class="btn btn-delete m5">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>`
    }

    if(proveedores.length==0){
        cadena+=`
        <tr>
            <td colspan="7" align="center">
            <br>
            <br>
                No hay proveedores registrados
            <br>
            <br>
            <a href="proveedoresForm.html" class="btn btn-nuevo">
                <i class="fa fa-plus"></i>
                Nuevo
            </a>
            <br>
            <br>
            </td>
        </tr>`
    }
    document.getElementById("listaProveedores").innerHTML=cadena;

}

const eliminarProveedor=(posicion)=>{
    Swal.fire({
        title: "Esta seguro?",
        text: "El proveedor se eliminará!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {            
            proveedores.splice(posicion, 1);
            localStorage.setItem('proveedores', JSON.stringify(proveedores));
            cargarDatos();

            Swal.fire({
                title: "Eliminado!",
                text: "El proveedor ha sido eliminada.",
                icon: "success",
            });
        }
    });
}

const editarProveedor=(posicion)=>{
    localStorage.setItem("proveedor_seleccionado",posicion);
    window.location.href="proveedoresForm.html";
}

const setearDatos=()=>{
    seleccionado=localStorage.getItem("proveedor_seleccionado");
    if(seleccionado!=null && seleccionado>=0 && seleccionado!=undefined){
        var elProve = proveedores[seleccionado];
        // seleccionado=posicion;
        document.getElementById("empresa").value=elProve.empresa;
        document.getElementById("contacto").value=elProve.contacto;
        document.getElementById("telefono").value=elProve.telefono;
        document.getElementById("correo").value=elProve.correo;
        document.getElementById("direccion").value=elProve.direccion;
    }
}
// setearDatos();

const buscarProveedor=()=>{
    var buscador=document.getElementById("buscar").value;
    var nuevoArray=[];

    if (buscador.trim()==""|| buscador.trim()==null){
        nuevoArray=JSON.parse(localStorage.getItem("proveedores")) || [];
    } else {
        for(let i=0;i<proveedores.length;i++){
            var texto=proveedores[i].empresa.toLowerCase();
            if(texto.search(buscador)>=0){
                nuevoArray.push(proveedores[i]);
            }
        }
    }
    proveedores=nuevoArray;
    cargarDatos();
}