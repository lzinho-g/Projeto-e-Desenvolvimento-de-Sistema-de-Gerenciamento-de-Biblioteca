document.addEventListener("DOMContentLoaded", () => {
    const profileImg = document.getElementById("profilePicture");
    const photoInput = document.getElementById("profilePhoto");
    const changeBtn = document.getElementById("changePhoto");

    // Carrega imagem salva no localStorage
    const savedImg = localStorage.getItem("fotoPerfil");
    if (savedImg) {
        profileImg.src = savedImg;
    }

    // Ao clicar no botão, aciona input
    changeBtn.addEventListener("click", () => {
        photoInput.click();
    });

    // Ao escolher nova foto
    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageBase64 = e.target.result;
            profileImg.src = imageBase64;
            localStorage.setItem("fotoPerfil", imageBase64);
        };
        reader.readAsDataURL(file);
    });
});
