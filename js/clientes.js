var clientes=JSON.parse(localStorage.getItem("clientes")) || [];
var seleccionado=null;

const registrarCliente=()=>{
    var nombre=document.getElementById("nombre").value;
    var apellido=document.getElementById("apellidos").value;
    var documento=document.getElementById("documento").value;
    var tipo=document.getElementById("tipo").value;
    var telefono=document.getElementById("telefono").value;
    var correo=document.getElementById("correo").value;
    
    if(nombre=="" || apellido=="" || documento=="" || tipo=="" || telefono=="" || correo=="" ){
        Swal.fire({
            icon: 'warning',
            title: 'Faltan Datos!',
            text: 'Por favor rellene todos los campos del formulario !!!'
        });
        return;
    }
    var cliente={
        nombre,
        apellido,
        documento,
        tipo,
        telefono,
        correo,
    }
    console.log(clientes);
    
    if(seleccionado!=null){
        clientes[seleccionado]=cliente;
        // localStorage.removeItem("proveedor_seleccionado");
    }else{
        clientes.push(cliente);
    }

    localStorage.setItem("clientes",JSON.stringify(clientes));

    window.location.href='clientes.html';
}
const cargarDatosC=()=>{
    var cadena="";
    for(var i=0;i<clientes.length;i++){
        cadena+=`
        <tr>
            <td>${i+1}</td>
            <td>${clientes[i].nombre}</td>
            <td>${clientes[i].apellido}</td>
            <td>${clientes[i].documento}</td>
            <td>${clientes[i].tipo}</td>
            <td>${clientes[i].telefono}</td>
            <td>${clientes[i].correo}</td>
            <td>
                <div class="acciones">
                    <button onclick="editarCliente(${i})" href="" class="btn btn-edit m5">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button href="" onclick="eliminarCliente(${i})" class="btn btn-delete m5">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>`
    }

    if(clientes.length==0){
        cadena+=`
        <tr>
            <td colspan="8" align="center">
            <br>
            <br>
                No hay Clientes registrados
            <br>
            <br>
            <a href="clientesForm.html" class="btn btn-nuevo">
                <i class="fa fa-plus"></i>
                Nuevo
            </a>
            <br>
            <br>
            </td>
        </tr>`
    }
    document.getElementById("listaClientes").innerHTML=cadena;

}
const eliminarCliente=(posicion)=>{
    Swal.fire({
        title: "Esta seguro?",
        text: "El cliente se eliminará!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {            
            clientes.splice(posicion, 1);
            localStorage.setItem('clientes', JSON.stringify(clientes));
            cargarDatosC();

            Swal.fire({
                title: "Eliminado!",
                text: "El cliente ha sido eliminado.",
                icon: "success",
            });
        }
    });
}

const editarCliente=(posicion)=>{
    localStorage.setItem("cliente_seleccionado",posicion);
    window.location.href="clientesForm.html";
}

const setearDatosC=()=>{
    seleccionado=localStorage.getItem("cliente_seleccionado");
    if(seleccionado!=null && seleccionado>=0 && seleccionado!=undefined){
        var elcliente = clientes[seleccionado];
        // seleccionado=posicion;
        document.getElementById("nombre").value=elcliente.nombre;
        document.getElementById("apellidos").value=elcliente.apellido;
        document.getElementById("documento").value=elcliente.documento;
        document.getElementById("tipo").value=elcliente.tipo;
        document.getElementById("telefono").value=elcliente.telefono;
        document.getElementById("correo").value=elcliente.correo;
    }
}

const buscarCliente=()=>{
    var buscador=document.getElementById("buscarcliente").value;
    var nuevoArray=[];

    if (buscador.trim()==""|| buscador.trim()==null){
        nuevoArray=JSON.parse(localStorage.getItem("clientes")) || [];
    } else {
        for(let i=0;i<clientes.length;i++){
            var texto=clientes[i].nombre.toLowerCase();
            if(texto.search(buscador)>=0){
                nuevoArray.push(clientes[i]);
            }
        }
    }
    clientes=nuevoArray;
    cargarDatosC();
}