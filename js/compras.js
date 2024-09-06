var productos=JSON.parse(localStorage.getItem("productos")) || [];
var proveedores=JSON.parse(localStorage.getItem("proveedores")) || [];
var compras = JSON.parse(localStorage.getItem("compras")) || [];
var carrito=[];

const quitarCarrito=(posicion)=>{
    carrito.splice(posicion,1);
    cargarCarrito();
}
const cargarProductos=()=>{
    var cadena="";
    for(var i=0;i<productos.length;i++){
        cadena+=`
        <tr>
            <td>${productos[i].producto}</td>
            <td>${productos[i].costo}</td>
            <td>${productos[i].stock}</td>
            <td>
                <div class="acciones">
                    <button href="" onclick="agregarCarrito(${i})" class="btn btn-nuevo m5">
                        <i class="fa fa-plus"></i>
                    </button>
                    
                </div>
            </td>
        </tr>`
    }
    
    if(productos.length==0){
        cadena+=`
        <tr>
            <td colspan="4" align="center">
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
    document.getElementById("listaCompras").innerHTML=cadena;

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
    cargarProductos();
}

const cargarProveedores=()=>{
    var cadena="";
    for(var i=0;i<proveedores.length;i++){
        cadena+=`<option value="${proveedores[i].empresa}">${proveedores[i].empresa}</option>`;
    }
    document.getElementById("proveedor").innerHTML=cadena;
}

const agregarCarrito=(parametro)=>{
    alert(parametro);
    var elemento={
        producto:productos[parametro].producto,
        costo:parseFloat(productos[parametro].costo) ,
        stock:productos[parametro].stock,
        cantidad:1,
        subtotal: function () {
            return this.cantidad * this.costo 
        }
    }
    carrito.push(elemento);
    console.log(carrito);
    
    cargarCarrito();
}
const cargarCarrito=()=>{
    var cadena="";
    for(let i=0;i<carrito.length;i++){
        cadena+=`
        <tr>
            <td>${carrito[i].producto}</td>
            <td>${carrito[i].costo}</td>
            <td>
                <input type="number" onchange="cambiaCantidad(${i},this)" value="${carrito[i].cantidad}" class="form" placeholder="Cantidad">
            </td>
            <td>${carrito[i].subtotal()}</td>
            <td>
                <button onclick="quitarCarrito(${i})" href="" class="btn btn-delete m5">
                    <i class="fa fa-times"></i>
                </button>
            </td>
        </tr>`
    }
    document.getElementById("listaCarrito").innerHTML=cadena;
    calcularTotal();
}

const calcularTotal=()=>{
    var total=0;
    for(let i=0;i<carrito.length;i++){
        total+=carrito[i].subtotal();
    }
    document.getElementById("total").innerText=total;
}
const cambiaCantidad=(posicion,elemento)=>{
    console.log(posicion,elemento.value);
    
    if(elemento.value<=0){
        Swal.fire({
            title: 'No puede ser 0!',
            icon: 'warning',
            text: 'La cantidad no puede ser menor o igual a 0'
        })
        return;
    }
    carrito[posicion].cantidad=(elemento.value !=null|| elemento.value!="")?elemento.value:1;
    cargarCarrito();
}

const registrarCompra=()=>{
    var proveedor=document.getElementById("proveedor").value;
    var fecha=document.getElementById("fecha").value;
    var comprobante=document.getElementById("numComprobante").value;
    
    var total=0;
    
    for(let i=0;i<carrito.length;i++){
        total+=carrito[i].subtotal();
    }

    if(proveedor=="" || fecha=="" || comprobante==""){
        Swal.fire({
            title: 'Campos vacios',
            icon: 'warning',
            text: 'Todos los campos son obligatorios'
        })
        return;
    }
    var compra={
        proveedor:proveedor,
        fecha:fecha,
        comprobante:comprobante,
        total:total,
        usuario:'Leandro Ledezma',
        detalles:carrito
    }

    compras.push(compra);
    localStorage.setItem("compras",JSON.stringify(compras));
    var losProductos=JSON.parse(localStorage.getItem("productos")) || [];
    //Actualizamos el stock de los productos
    for(let i=0;i<carrito.length;i++){
        for(let j=0;j<losProductos.length;j++){
            if(losProductos[j].producto==carrito[i].producto){
                losProductos[j].stock=parseInt(losProductos[j].stock)+parseInt(carrito[i].cantidad);
            }
        }
    }
    localStorage.setItem("productos",JSON.stringify(losProductos));
    window.location.href="compras.html";
    
    // cargarCompras();
}
const cargarDatos=()=>{
    var cadena="";
    for(var i=0;i<compras.length;i++){
        cadena+=`
        <tr>
            <td>${i+1}</td>
            <td>${compras[i].proveedor}</td>
            <td>${compras[i].fecha}</td>
            <td>${compras[i].comprobante}</td>
            <td>${compras[i].total}</td>
            <td>${compras[i].usuario}</td>
            <td>
                <div class="acciones">
                    <button onclick="verCompra(${i})" href="" class="btn btn-show m5">
                        <i class="fa fa-eye"></i>
                    </button>
                    <button href="" onclick="eliminarCompra(${i})" class="btn btn-delete m5">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>`
    }

    if(compras.length==0){
        cadena+=`
        <tr>
            <td colspan="7" align="center">
            <br>
            <br>
                No hay productos registrados
            <br>
            <br>
            <a href="comprasForm.html" class="btn btn-nuevo">
                <i class="fa fa-plus"></i>
                Nuevo
            </a>
            <br>
            <br>
            </td>
        </tr>`
    }
    document.getElementById("listaCompra").innerHTML=cadena;
    cargarTotales();////////////////////////////
}

const buscarCompra=()=>{
    var buscador=document.getElementById("buscarCompra").value;
    var nuevoArray=[];
    if (buscador.trim()==""|| buscador.trim()==null){
        nuevoArray=JSON.parse(localStorage.getItem("compras")) || [];
    } else {
        for(let i=0;i<compras.length;i++){
            var texto=compras[i].proveedor.toLowerCase();
            if(texto.search(buscador)>=0){
                nuevoArray.push(compras[i]);
            }
        }
    }
    compras=nuevoArray;
    cargarDatos();
}

const eliminarCompra=(posicion)=>{
    var laCompra=compras[posicion];
    console.log(laCompra.detalles);

    Swal.fire({
        title: 'Esta seguro?',
        text: "La compra se eliminara!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            var losProductos=JSON.parse(localStorage.getItem("productos")) || [];
            //Actualizamos el stock de los productos
            for(let i=0;i<laCompra.detalles.length;i++){
                for(let j=0;j<losProductos.length;j++){
                    if(losProductos[j].producto==laCompra.detalles[i].producto){
                        if(parseInt(losProductos[j].stock)>=parseInt(laCompra.detalles[i].cantidad)){
                            losProductos[j].stock=parseInt(losProductos[j].stock)-parseInt(laCompra.detalles[i].cantidad);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error!',
                                text: 'No hay suficiente productos'
                            });
                            return;
                        }
                    }
                }
            }
            localStorage.setItem("productos",JSON.stringify(losProductos));
            compras.splice(posicion,1);
            localStorage.setItem("compras",JSON.stringify(compras));
            cargarDatos();
            Swal.fire({
                title: 'Eliminado!',
                text: 'La compra ha sido eliminada.',
                icon: 'success',
            })
        }
    })
}

const verCompra=(posicion)=>{
    localStorage.setItem("posicionCompra",posicion);
    window.location.href="comprasVer.html";
}

const mostrarCompras=()=>{
    var posicion=localStorage.getItem("posicionCompra");
    var laCompra=compras[posicion];

    console.log(laCompra);
    
    if(laCompra==undefined|| laCompra==null){
        Swal.fire({
            icon: 'warning',
            title: 'No existe la compra!',
            text: 'La compra no existe'
        }).then((result) => {
            window.location.href="compras.html";
        })
    }

    document.getElementById("proveedor").innerText=laCompra.proveedor;
    document.getElementById("fecha").innerText=laCompra.fecha;
    document.getElementById("numComprobante").innerText=laCompra.comprobante;
    document.getElementById("usuario").innerText=laCompra.usuario;
    document.getElementById("ltotal").innerText=laCompra.total;
    document.getElementById("total").innerText=laCompra.total;

    var cadena="";
    for(let i=0;i<laCompra.detalles.length;i++){
        var subtotal=parseFloat(laCompra.detalles[i].costo)*parseFloat(laCompra.detalles[i].cantidad);
        cadena+=`
        <tr>
            <td>${laCompra.detalles[i].producto}</td>
            <td>${laCompra.detalles[i].costo}</td>
            <td>${laCompra.detalles[i].cantidad}</td>
            <td>${subtotal}</td>
        </tr>
        `;
    }

    document.getElementById("listaVer").innerHTML=cadena;
}

const cargarTotales=()=>{
    var cantidadCompras=0;
    var comprasMes=0;
    var totalCompras=0;

    for(let i=0;i<compras.length;i++){
        totalCompras+=parseFloat(compras[i].total);
        var laFecha = compras[i].fecha;
        var laFecha = new Date(laFecha);
        var fechaActual = new Date();

        // console.log(laFecha.getMonth());
        if(laFecha.getFullYear()==fechaActual.getFullYear()){
            totalCompras+=parseFloat(compras[i].total);
            if(laFecha.getMonth()==fechaActual.getMonth()){
                comprasMes+=parseFloat(compras[i].total);
            }
            cantidadCompras++;
        }
    }

    document.getElementById("cantidadCompras").innerText=cantidadCompras;
    document.getElementById("comprasMes").innerText=comprasMes;
    document.getElementById("totalCompras").innerText=totalCompras;
}