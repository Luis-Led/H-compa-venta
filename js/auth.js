const login = () => {
    var usuario=document.getElementById("usuario").value;
    var contrasena=document.getElementById("contrasena").value;
    if (usuario=="admin" && contrasena=="admin.1") {
        localStorage.setItem('sesion','si')
        Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Credenciales correctas'
        }).then((result) => {
            window.location.href = "index.html";
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Credenciales no son validas!!!'
        }).then((result) => {
            localStorage.removeItem('sesion')
            window.location.href = "login.html";
        })
        return;
    }
}

const verificar=() => {
    if(localStorage.getItem('sesion')=='si'){
        // window.location.href = "index.html";
    }else{
        window.location.href = "login.html";
    }
}

const logout=() => {
    Swal.fire({
        title: 'Esta seguro?',
        text: "Se cerrara la sesion!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, quiero cerrar!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('sesion')
            window.location.href = "login.html";
        }
    })

    // localStorage.removeItem('sesion')
    // window.location.href = "login.html";
}

// verificar();