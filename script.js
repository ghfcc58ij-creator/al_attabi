/* =========================================================
   A.H.R | PROJECTS & FILES
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://xiouxcidmkpnfpqnecmr.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_zuCL47NRFv9NlDuplF-P8g_LbURuJCt";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   PASSWORD
========================================================= */

const ADMIN_PASSWORD =
    "ghfcc58@gma";


/* =========================================================
   VARIABLES
========================================================= */

let fileToDelete = null;


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    title,
    description,
    type = "success"
) {

    const popup =
        document.getElementById(
            "messagePopup"
        );

    const icon =
        document.getElementById(
            "messageIcon"
        );

    const titleElement =
        document.getElementById(
            "messageTitle"
        );

    const descriptionElement =
        document.getElementById(
            "messageDescription"
        );


    if (!popup) return;


    titleElement.textContent =
        title;


    descriptionElement.textContent =
        description;


    icon.textContent =
        type === "success"
            ? "✓"
            : "×";


    popup.classList.add(
        "show"
    );


    clearTimeout(
        window.messageTimer
    );


    window.messageTimer =
        setTimeout(
            () => {

                popup.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================================================
   LOGIN
========================================================= */

function login() {

    const input =
        document.getElementById(
            "adminPassword"
        );


    const password =
        input.value;


    if (!password) {

        showMessage(
            "أدخل كلمة المرور",
            "اكتب كلمة المرور أولاً",
            "error"
        );

        return;

    }


    if (
        password ===
        ADMIN_PASSWORD
    ) {

        document
            .getElementById(
                "uploadArea"
            )
            .classList.remove(
                "hidden"
            );


        input.value = "";


        showMessage(
            "تم التحقق بنجاح",
            "يمكنك الآن رفع الملفات",
            "success"
        );


    } else {

        showMessage(
            "كلمة المرور غير صحيحة",
            "تأكد من كلمة المرور وحاول مرة أخرى",
            "error"
        );


        input.value = "";

        input.focus();

    }

}


/* =========================================================
   FILE SIZE
========================================================= */

function formatFileSize(bytes) {

    if (
        !bytes ||
        bytes <= 0
    ) {

        return "0 KB";

    }


    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    const size =
        bytes /
        Math.pow(
            1024,
            index
        );


    return (
        size.toFixed(
            index === 0
                ? 0
                : 2
        )
        +
        " "
        +
        units[index]
    );

}


/* =========================================================
   EXTENSION
========================================================= */

function getExtension(name) {

    const parts =
        name.split(".");


    if (
        parts.length <= 1
    ) {

        return "FILE";

    }


    return parts
        .pop()
        .toUpperCase();

}


/* =========================================================
   FILE ICON
========================================================= */

function getFileIcon(name) {

    const ext =
        getExtension(name);


    const icons = {

        MP4: "🎬",
        MOV: "🎬",
        AVI: "🎬",
        MKV: "🎬",
        WEBM: "🎬",

        MP3: "🎵",
        WAV: "🎵",
        AAC: "🎵",
        FLAC: "🎵",

        PNG: "🖼️",
        JPG: "🖼️",
        JPEG: "🖼️",
        WEBP: "🖼️",
        GIF: "🖼️",

        PSD: "🎨",
        AEP: "🎞️",

        ZIP: "📦",
        RAR: "📦",
        "7Z": "📦",

        PDF: "📕",

        APK: "📱",

        HTML: "🌐",
        CSS: "🌐",
        JS: "⚙️",

        EXE: "⚙️"

    };


    return (
        icons[ext] ||
        "📁"
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   CREATE SAFE NAME
========================================================= */

function cleanFileName(name) {

    return name
        .replace(
            /[^a-zA-Z0-9\u0600-\u06FF._\- ()]/g,
            "_"
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   UPLOAD PROJECT + PREVIEW
========================================================= */

async function uploadFile() {

    const fileInput =
        document.getElementById(
            "fileInput"
        );


    const previewInput =
        document.getElementById(
            "previewInput"
        );


    const status =
        document.getElementById(
            "status"
        );


    if (
        !fileInput.files ||
        !fileInput.files.length
    ) {

        showMessage(
            "لم يتم اختيار المشروع",
            "اختر ملف المشروع أولاً",
            "error"
        );

        return;

    }


    if (
        !previewInput.files ||
        !previewInput.files.length
    ) {

        showMessage(
            "لم يتم اختيار الصورة",
            "اختر صورة توضح شكل المشروع",
            "error"
        );

        return;

    }


    const projectFile =
        fileInput.files[0];


    const previewFile =
        previewInput.files[0];


    if (
        !previewFile.type.startsWith(
            "image/"
        )
    ) {

        showMessage(
            "الصورة غير صحيحة",
            "اختر ملف صورة فقط",
            "error"
        );

        return;

    }


    status.textContent =
        "جاري رفع المشروع والصورة...";


    /*
       رقم موحد للملف والصورة
    */

    const id =
        Date.now();


    const projectName =
        cleanFileName(
            projectFile.name
        );


    const finalProjectName =
        id +
        "_" +
        projectName;


    const previewName =
        id +
        "_" +
        "preview.jpg";


    try {


        /* ================================================
           1. رفع المشروع
        ================================================= */

        const projectResult =
            await supabaseClient
                .storage
                .from("files")
                .upload(
                    finalProjectName,
                    projectFile,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false
                    }
                );


        if (
            projectResult.error
        ) {

            console.error(
                projectResult.error
            );


            showMessage(
                "فشل رفع المشروع",
                projectResult.error.message,
                "error"
            );


            status.textContent =
                "فشل رفع المشروع";


            return;

        }


        /* ================================================
           2. رفع صورة المشروع
        ================================================= */

        const previewResult =
            await supabaseClient
                .storage
                .from("files")
                .upload(
                    "previews/" +
                    previewName,
                    previewFile,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            previewFile.type
                    }
                );


        if (
            previewResult.error
        ) {

            console.error(
                previewResult.error
            );


            /*
               إذا فشلت الصورة
               نحذف المشروع حتى لا يبقى ناقص
            */

            await supabaseClient
                .storage
                .from("files")
                .remove([
                    finalProjectName
                ]);


            showMessage(
                "فشل رفع صورة المشروع",
                "لم يتم حفظ المشروع",
                "error"
            );


            status.textContent =
                "فشل رفع الصورة";


            return;

        }


        /* ================================================
           SUCCESS
        ================================================= */

        status.textContent =
            "تم رفع المشروع بنجاح";


        fileInput.value = "";

        previewInput.value = "";


        document
            .getElementById(
                "previewBox"
            )
            .classList.add(
                "hidden"
            );


        document
            .getElementById(
                "previewImage"
            )
            .src = "";


        showMessage(
            "تم رفع المشروع",
            "تم حفظ المشروع وصورته بنجاح",
            "success"
        );


        loadFiles();


    } catch (error) {

        console.error(
            error
        );


        showMessage(
            "حدث خطأ",
            "تعذر رفع المشروع",
            "error"
        );

    }

}


/* =========================================================
   LOAD FILES
========================================================= */

async function loadFiles() {

    const list =
        document.getElementById(
            "fileList"
        );


    if (!list) return;


    list.innerHTML = `
        <div class="empty-files">
            جاري تحميل الملفات...
        </div>
    `;


    try {


        const result =
            await supabaseClient
                .storage
                .from("files")
                .list(
                    "",
                    {
                        limit: 100,

                        offset: 0,

                        sortBy: {
                            column:
                                "created_at",

                            order:
                                "desc"
                        }
                    }
                );


        if (
            result.error
        ) {

            console.error(
                result.error
            );


            list.innerHTML = `
                <div class="empty-files">
                    تعذر تحميل الملفات
                </div>
            `;


            return;

        }


        const files =
            result.data;


        list.innerHTML = "";


        if (
            !files ||
            files.length === 0
        ) {

            list.innerHTML = `
                <div class="empty-files">
                    📁 لا توجد ملفات حالياً
                </div>
            `;


            return;

        }


        files.forEach(
            (file, index) => {


                /*
                   تجاهل مجلد previews
                */

                if (
                    file.name ===
                    "previews"
                ) {

                    return;

                }


                if (!file.name) {
                    return;
                }


                /*
                   إذا كان Storage يرجع مجلد
                */

                if (
                    file.id === null &&
                    file.metadata === null
                ) {

                    return;

                }


                const publicURL =
                    supabaseClient
                        .storage
                        .from("files")
                        .getPublicUrl(
                            file.name
                        )
                        .data
                        .publicUrl;


                const extension =
                    getExtension(
                        file.name
                    );


                const icon =
                    getFileIcon(
                        file.name
                    );


                const size =
                    file.metadata &&
                    file.metadata.size
                        ? formatFileSize(
                            file.metadata.size
                        )
                        : "غير معروف";


                /*
                   استخراج ID من اسم الملف
                */

                const firstPart =
                    file.name.split("_")[0];


                const previewURL =
                    supabaseClient
                        .storage
                        .from("files")
                        .getPublicUrl(
                            "previews/" +
                            firstPart +
                            "_preview.jpg"
                        )
                        .data
                        .publicUrl;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "file-card";


                card.style.animationDelay =
                    `${index * 0.06}s`;


                card.innerHTML = `

                    <div class="file-preview">

                        <img
                            src="${previewURL}"
                            alt="Project Preview"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        >

                        <div
                            class="default-preview"
                            style="display:none;"
                        >

                            <i class="fa-solid fa-file"></i>

                            <span>
                                ${extension}
                            </span>

                        </div>

                    </div>


                    <div class="file-content">


                        <div class="file-top">


                            <div class="file-icon">

                                ${icon}

                            </div>


                            <div class="file-info">

                                <div
                                    class="file-name"
                                    title="${escapeHTML(file.name)}"
                                >

                                    ${escapeHTML(
                                        file.name
                                    )}

                                </div>


                                <div class="file-details">

                                    <span>
                                        ${extension}
                                    </span>

                                    <span>
                                        •
                                    </span>

                                    <span>
                                        ${size}
                                    </span>

                                </div>

                            </div>


                        </div>



                        <div class="file-actions">


                            <a
                                class="download"
                                href="${publicURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >

                                <i class="fa-solid fa-download"></i>

                                تحميل الملف

                            </a>


                            <button
                                class="delete"
                                onclick="openDeleteModal('${encodeURIComponent(file.name)}')"
                                title="حذف المشروع"
                            >

                                <i class="fa-solid fa-trash"></i>

                            </button>


                        </div>


                    </div>

                `;


                list.appendChild(
                    card
                );

            }
        );


        /*
           إذا ما بقى أي ملف
        */

        if (
            list.children.length === 0
        ) {

            list.innerHTML = `
                <div class="empty-files">
                    📁 لا توجد ملفات حالياً
                </div>
            `;

        }


    } catch (error) {

        console.error(
            error
        );


        list.innerHTML = `
            <div class="empty-files">
                حدث خطأ أثناء تحميل الملفات
            </div>
        `;

    }

}


/* =========================================================
   DELETE MODAL
========================================================= */

function openDeleteModal(
    encodedName
) {

    fileToDelete =
        decodeURIComponent(
            encodedName
        );


    const modal =
        document.getElementById(
            "deleteModal"
        );


    const password =
        document.getElementById(
            "deletePassword"
        );


    password.value = "";


    modal.classList.add(
        "show"
    );


    setTimeout(
        () => {

            password.focus();

        },
        200
    );

}


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    fileToDelete =
        null;


    document
        .getElementById(
            "deleteModal"
        )
        .classList.remove(
            "show"
        );

}


/* =========================================================
   DELETE PROJECT + PREVIEW
========================================================= */

async function confirmDelete() {

    const password =
        document.getElementById(
            "deletePassword"
        ).value;


    if (!password) {

        showMessage(
            "أدخل كلمة المرور",
            "اكتب كلمة المرور أولاً",
            "error"
        );

        return;

    }


    if (
        password !==
        ADMIN_PASSWORD
    ) {

        showMessage(
            "كلمة المرور غير صحيحة",
            "لا يمكن حذف المشروع",
            "error"
        );

        return;

    }


    if (!fileToDelete) {

        closeDeleteModal();

        return;

    }


    try {


        /*
           استخراج ID
        */

        const id =
            fileToDelete
                .split("_")[0];


        const previewName =
            "previews/" +
            id +
            "_preview.jpg";


        /*
           حذف المشروع والصورة معًا
        */

        const result =
            await supabaseClient
                .storage
                .from("files")
                .remove([
                    fileToDelete,
                    previewName
                ]);


        if (
            result.error
        ) {

            console.error(
                result.error
            );


            showMessage(
                "فشل حذف المشروع",
                result.error.message,
                "error"
            );


            return;

        }


        closeDeleteModal();


        showMessage(
            "تم حذف المشروع",
            "تم حذف المشروع وصورته",
            "success"
        );


        loadFiles();


    } catch (error) {

        console.error(
            error
        );


        showMessage(
            "حدث خطأ",
            "تعذر حذف المشروع",
            "error"
        );

    }

}


/* =========================================================
   IMAGE PREVIEW BEFORE UPLOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        const passwordInput =
            document.getElementById(
                "adminPassword"
            );


        if (passwordInput) {

            passwordInput.addEventListener(
                "keydown",
                (event) => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        login();

                    }

                }
            );

        }


        const previewInput =
            document.getElementById(
                "previewInput"
            );


        const previewBox =
            document.getElementById(
                "previewBox"
            );


        const previewImage =
            document.getElementById(
                "previewImage"
            );


        if (
            previewInput
        ) {

            previewInput.addEventListener(
                "change",
                () => {

                    const file =
                        previewInput.files[0];


                    if (!file) {

                        previewBox.classList.add(
                            "hidden"
                        );

                        return;

                    }


                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        showMessage(
                            "ملف غير صحيح",
                            "اختر صورة فقط",
                            "error"
                        );


                        previewInput.value = "";


                        return;

                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        (event) => {

                            previewImage.src =
                                event.target.result;


                            previewBox.classList.remove(
                                "hidden"
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }


        loadFiles();

    }
);


/* =========================================================
   DELETE MODAL KEYS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {


        const modal =
            document.getElementById(
                "deleteModal"
            );


        if (
            event.key ===
            "Escape"
        ) {

            closeDeleteModal();

        }


        if (
            event.key ===
            "Enter" &&
            modal.classList.contains(
                "show"
            )
        ) {

            confirmDelete();

        }

    }
);