var productos=JSON.parse(localStorage.getItem("productos")) || [];
var clientes=JSON.parse(localStorage.getItem("clientes")) || [];
var ventas = JSON.parse(localStorage.getItem("ventas")) || [];
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
            <td>${productos[i].precio}</td>
            <td>${productos[i].stock}</td>
            <td>
                <div class="acciones">
                    <button href="" onclick="agregarCarrito(${i})" class="btn btn-nuevo m5">
                        <i class="fa fa-plus"></i>
                    </button>
                    
                </div>
            </td>
        </tr>`;
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
    document.getElementById("listaProductos").innerHTML=cadena;

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

const cargarClientes=()=>{
    var cadena="";
    for(var i=0;i<clientes.length;i++){
        cadena+=`
        <option value="${clientes[i].nombre}"> ${clientes[i].nombre} ${clientes[i].apellido} </option> </option>`
    }
        
    document.getElementById("cliente").innerHTML=cadena;
}

const agregarCarrito=(parametro)=>{
    alert(parametro);
    var elemento={
        producto:productos[parametro].producto,
        precio:productos[parametro].precio,
        stock:productos[parametro].stock,
        cantidad:1,
        subtotal: function () {
            return this.cantidad * this.precio
        }
    }
    carrito.push(elemento);
    cargarCarrito();
}
const cargarCarrito=()=>{
    var cadena="";
    for(let i=0;i<carrito.length;i++){
        cadena+=`
        <tr>
            <td>${carrito[i].producto}</td>
            <td>${carrito[i].precio}</td>
            <td>
                <input type="number" onkeyup="cambiaCantidad(${i},this)" value="${carrito[i].cantidad}" class="form" placeholder="Cantidad">
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
    var descuento=document.getElementById("descuento").value;
    var total=0;
    for(let i=0;i<carrito.length;i++){
        total+=carrito[i].subtotal();
    }
    document.getElementById("total").innerText=total;
    document.getElementById("totalNeto").innerText=total-parseFloat(descuento);
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

const registrarVenta=()=>{
    var cliente=document.getElementById("cliente").value;
    var fecha=document.getElementById("fecha").value;
    var comprobante = document.getElementById("numComprobante").value;
    var descuento=document.getElementById("descuento").value;
    
    var total=0;
    
    for(let i=0;i<carrito.length;i++){
        total+=carrito[i].subtotal();
    }

    if(cliente=="" || fecha=="" || comprobante==""|| total==0){
        Swal.fire({
            title: 'Campos vacios',
            icon: 'warning',
            text: 'Todos los campos son obligatorios'
        })
        return;
    }
    var venta={
        cliente:cliente,
        fecha:fecha,
        comprobante:comprobante,
        total:total,
        descuento:(descuento=='')?0:descuento,
        usuario:'Leandro Ledezma',
        detalles:carrito
    }

    ventas.push(venta);
    localStorage.setItem("ventas",JSON.stringify(ventas));

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
    window.location.href="ventas.html";
    
    // cargarCompras();
}
const cargarDatos=()=>{
    var cadena="";
    for(var i=0;i<ventas.length;i++){
        cadena+=`
        <tr>
            <td>${i+1}</td>
            <td>${ventas[i].cliente}</td>
            <td>${ventas[i].fecha}</td>
            <td>${ventas[i].comprobante}</td>
            <td>${ventas[i].total}</td>
            <td>${ventas[i].descuento}</td>
            <td>${parseFloat(ventas[i].total)-parseFloat(ventas[i].descuento)}</td>
            <td>${ventas[i].usuario}</td>
            <td>
                <div class="acciones">
                    <button onclick="verVenta(${i})" href="" class="btn btn-show m5">
                        <i class="fa fa-eye"></i>
                    </button>
                    <button href="" onclick="eliminarVenta(${i})" class="btn btn-delete m5">
                        <i class="fa fa-times"></i>
                    </button>
                </div>
            </td>
        </tr>`
        console.log(ventas[i].cliente);
        
    }

    if(ventas.length==0){
        cadena+=`
        <tr>
            <td colspan="9" align="center">
            <br>
            <br>
                No hay ventas registradas
            <br>
            <br>
            <a href="ventasForm.html" class="btn btn-nuevo">
                <i class="fa fa-plus"></i>
                Nuevo
            </a>
            <br>
            <br>
            </td>
        </tr>`
    }
    document.getElementById("listaVentas").innerHTML=cadena;
    cargarTotales();////////////////////////////
}

const buscarVenta=()=>{
    var buscador=document.getElementById("buscarVenta").value;
    var nuevoArray=[];
    if (buscador.trim()==""|| buscador.trim()==null){
        nuevoArray=JSON.parse(localStorage.getItem("ventas")) || [];
    } else {
        for(let i=0;i<ventas.length;i++){
            var texto=ventas[i].cliente.toLowerCase();
            if(texto.search(buscador)>=0){
                nuevoArray.push(ventas[i]);
            }
        }
    }
    ventas=nuevoArray;
    cargarDatos();
}

const eliminarVenta=(posicion)=>{
    var laVenta=ventas[posicion];
    // console.log(laCompra.detalles);

    Swal.fire({
        title: 'Esta seguro?',
        text: "La venta se eliminara, y se devolvera el stock",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            var losProductos=JSON.parse(localStorage.getItem("productos")) || [];
            //Actualizamos el stock de los productos
            for(let i=0;i<laVenta.detalles.length;i++){
                for(let j=0;j<losProductos.length;j++){
                    if(losProductos[j].producto==laVenta.detalles[i].producto){
                        if(parseInt(losProductos[j].stock)>=parseInt(laVenta.detalles[i].cantidad)){
                            losProductos[j].stock=parseInt(losProductos[j].stock)-parseInt(laVenta.detalles[i].cantidad);
                        }
                    }
                }
            }
            localStorage.setItem("productos",JSON.stringify(losProductos));
            ventas.splice(posicion,1);
            localStorage.setItem("ventas",JSON.stringify(ventas));
            cargarDatos();
            Swal.fire({
                title: 'Eliminado!',
                text: 'La venta ha sido eliminada.',
                icon: 'success',
            })
        }
    })
}

const verVenta=(posicion)=>{
    localStorage.setItem("posicionVenta",posicion);
    window.location.href="ventasVer.html";
}

const mostrarVenta=()=>{
    var posicion=localStorage.getItem("posicionVenta");
    var laVenta=ventas[posicion];
    
    if(laVenta==undefined|| laVenta==null){
        Swal.fire({
            icon: 'warning',
            title: 'No existe la venta o ha sido eliminada!',
            text: 'La venta no existe'
        }).then((result) => {
            window.location.href="ventas.html";
        })
    }

    document.getElementById("cliente").innerText=laVenta.cliente;
    document.getElementById("fecha").innerText=laVenta.fecha;
    document.getElementById("numComprobante").innerText=laVenta.comprobante;
    document.getElementById("total").innerText=laVenta.total;
    document.getElementById("descuento").innerText=laVenta.descuento;
    document.getElementById("totalNeto").innerText=parseFloat(laVenta.total)-parseFloat(laVenta.descuento);
    document.getElementById("usuario").innerText=laVenta.usuario;
    document.getElementById("ltotal").innerText=laVenta.total;

    var cadena="";
    for(let i=0;i<laVenta.detalles.length;i++){
        var subtotal=parseFloat(laVenta.detalles[i].precio)*parseFloat(laVenta.detalles[i].cantidad);
        cadena+=`
        <tr>
            <td>${laVenta.detalles[i].producto}</td>
            <td>${laVenta.detalles[i].precio}</td>
            <td>${laVenta.detalles[i].cantidad}</td>
            <td>${subtotal}</td>
        </tr>
        `;
    }

    document.getElementById("listaVer").innerHTML=cadena;
}

const cargarTotales=()=>{
    var cantidadVentas=0;
    var ventasMes=0;
    var totalVentas=0;

    for(let i=0;i<ventas.length;i++){
        var laFecha = ventas[i].fecha;
        var laFecha = new Date(laFecha);
        var fechaActual = new Date();
        // console.log(laFecha.getMonth());
        if(laFecha.getFullYear()==fechaActual.getFullYear()){
            totalVentas+=parseFloat(ventas[i].total)-parseFloat(ventas[i].descuento);
            if(laFecha.getMonth()==fechaActual.getMonth()){
                ventasMes+=parseFloat(ventas[i].total)-parseFloat(ventas[i].descuento);
            }
            cantidadVentas++;
        }
    }

    document.getElementById("cantidadVentas").innerText=cantidadVentas;
    document.getElementById("ventasMes").innerText=ventasMes;
    document.getElementById("totalVentas").innerText=totalVentas;
}