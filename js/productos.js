var productos=JSON.parse(localStorage.getItem("productos")) || [];
var seleccionado=null;

const registrarProducto=()=>{
    var producto=document.getElementById("producto").value;
    var precio=document.getElementById("precio").value;
    var costo=document.getElementById("costo").value;
    var stock=document.getElementById("stock").value;
    
    if(producto=="" || costo=="" ||precio=="" ||stock==""){
        Swal.fire({
            icon: 'warning',
            title: 'Faltan Datos!',
            text: 'Por favor rellene todos los campos del formulario !!!'
        });
        return;
    }
    var product={
        producto,
        precio,
        costo,
        stock
    }
    console.log(productos);
    
    if(seleccionado!=null){
        productos[seleccionado]=product;
        // localStorage.removeItem("proveedor_seleccionado");
    }else{
        productos.push(product);
    }

    localStorage.setItem("productos",JSON.stringify(productos));

    window.location.href='productos.html';
}
const cargarDatosP=()=>{
    var cadena="";
    for(var i=0;i<productos.length;i++){
        cadena+=`
        <tr>
            <td>${i+1}</td>
            <td>${productos[i].producto}</td>
            <td>${productos[i].costo}</td>
            <td>${productos[i].precio}</td>
            <td>${productos[i].stock}</td>
            <td>
                <div class="acciones">
                    <button onclick="editarProducto(${i})" href="" class="btn btn-edit m5">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button href="" onclick="eliminarProducto(${i})" class="btn btn-delete m5">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>`
    }

    if(productos.length==0){
        cadena+=`
        <tr>
            <td colspan="6" align="center">
            <br>
            <br>
                No hay productos registrados
            <br>
            <br>
            <a href="productosForm.html" class="btn btn-nuevo">
                <i class="fa fa-plus"></i>
                Nuevo
            </a>
            <br>
            <br>
            </td>
        </tr>`
    }
    document.getElementById("listaProducto").innerHTML=cadena;

}
const eliminarProducto=(posicion)=>{
    Swal.fire({
        title: "Esta seguro?",
        text: "El producto se eliminará!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, quiero eliminar!",
    }).then((result) => {
        if (result.isConfirmed) {            
            productos.splice(posicion, 1);
            localStorage.setItem('productos', JSON.stringify(productos));
            cargarDatosP();

            Swal.fire({
                title: "Eliminado!",
                text: "El producto ha sido eliminado.",
                icon: "success",
            });
        }
    });
}

const editarProducto=(posicion)=>{
    localStorage.setItem("producto_seleccionado",posicion);
    window.location.href="productosForm.html";
}

const setearDatosP=()=>{
    seleccionado=localStorage.getItem("producto_seleccionado");
    if(seleccionado!=null && seleccionado>=0 && seleccionado!=undefined){
        var elpruducto = productos[seleccionado];
        // seleccionado=posicion;
        document.getElementById("producto").value=elpruducto.producto;
        document.getElementById("precio").value=elpruducto.precio;
        document.getElementById("costo").value=elpruducto.costo;
        document.getElementById("stock").value=elpruducto.stock;        
    }
}

const buscarProducto=()=>{
    var buscador=document.getElementById("buscarProducto").value;
    var nuevoArray=[];

    if (buscador.trim()==""|| buscador.trim()==null){
        nuevoArray=JSON.parse(localStorage.getItem("productos")) || [];
    } else {
        for(let i=0;i<productos.length;i++){
            var texto=productos[i].producto.toLowerCase();
            if(texto.search(buscador)>=0){
                nuevoArray.push(productos[i]);
            }
        }
    }
    productos=nuevoArray;
    cargarDatosP();
}