var compras=JSON.parse(localStorage.getItem("compras")) || [];
var ventas=JSON.parse(localStorage.getItem("ventas")) || [];

var meses=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    

const cargarTotales=()=>{
    var comprasMes=0;
    var totalCompras=0;
    var ventasMes=0;
    var totalVentas=0;

    var fechaActual=new Date();
    //Para Compras
    for(let i=0;i<compras.length;i++){
        var laFecha = compras[i].fecha;
        var laFecha = new Date(laFecha);
        if(laFecha.getMonth()==fechaActual.getMonth()){
            totalCompras+=parseFloat(compras[i].total);
            if(laFecha.getFullYear()==fechaActual.getFullYear()){
                comprasMes+=parseFloat(compras[i].total);
            }
        }
    }
    document.getElementById("comprasMes").innerText=comprasMes;
    document.getElementById("totalCompras").innerText=totalCompras;

    //Para Ventas
    for(let i=0;i<ventas.length;i++){
        var laFecha = ventas[i].fecha;
        var laFecha = new Date(laFecha);
        if(laFecha.getFullYear()==fechaActual.getFullYear()){
            totalVentas+=parseFloat(ventas[i].total)-parseFloat(ventas[i].descuento);
            if(laFecha.getMonth()==fechaActual.getMonth()){
                ventasMes+=parseFloat(ventas[i].total)-parseFloat(ventas[i].descuento);
            }
        }
    }
    document.getElementById("ventasMes").innerText=ventasMes;
    document.getElementById("totalVentas").innerText=totalVentas;
}

const graficoVentas=()=>{
    var ventasArray=[];
    var comprasArray=[];
    for(let i=0;i<meses.length;i++){
        ventasArray[i]=0;
        for(let j=0;j<ventas.length;j++){
            var fecha=new Date(ventas[j].fecha);
            if(fecha.getMonth()==i){
                ventasArray[i]+=parseFloat(ventas[j].total)-parseFloat(ventas[j].descuento);
            }
        }
    }
    for(let i=0;i<meses.length;i++){
        comprasArray[i]=0;
        for(let j=0;j<compras.length;j++){
            var fecha=new Date(compras[j].fecha);
            if(fecha.getMonth()==i){
                comprasArray[i]+=parseFloat(compras[j].total);
            }
        }
    }
    
    var options = {
        chart:{
            type: 'area',
        },
        series: [
            {
                name: 'Ventas',
                data: ventasArray
            },
            {
                name: 'Compras',
                data: comprasArray
            }
        ],
        xaxis: {
            categories: meses
        }
    }

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}
graficoVentas();
cargarTotales();

const graficoProductos=()=>{
    var arrayProductos=[];
    var arrayCantidades=[];

    var productos=JSON.parse(localStorage.getItem("productos")) || [];
    for(let i=0;i<productos.length;i++){
        arrayProductos[i]=productos[i].producto;
        arrayCantidades[i]=0;
        //Recorrer las ventas
        for(let v=0;v<ventas.length;v++){
            //Recorrer los detalles de la venta
            var detalles = ventas[v].detalles;
            for(let vd=0;vd<detalles.length;vd++){
                if(productos[i].producto==detalles[vd].producto){
                    arrayCantidades[i]+=parseFloat(detalles[vd].cantidad);
                }
            }
        }
    }
    var options = {
        series: arrayCantidades,
        labels: arrayProductos,
        chart: {
            type: 'donut',
        }
    }
    var grafico=new ApexCharts(document.querySelector("#chart-productos"), options);
    grafico.render();
}

graficoProductos();