// ==========================================
// إعداد Supabase
// ==========================================

const SUPABASE_URL = "https://xiouxcidmkpnfpqnecmr.supabase.co";
const SUPABASE_KEY = "sb_publishable_zuCL47NRFv9NlDuplF-P8g_LbURuJCt";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// كلمة مرور لوحة التحكم
// ==========================================

// غيّرها إلى كلمة مرورك
const ADMIN_PASSWORD = "ghfcc58@gma";


// ==========================================
// تسجيل الدخول
// ==========================================

function login() {

    const password =
        document.getElementById("adminPassword").value;

    if (password === ADMIN_PASSWORD) {

        document
            .getElementById("uploadArea")
            .classList.remove("hidden");

        alert("تم تسجيل الدخول بنجاح");

    } else {

        alert("كلمة المرور خاطئة");

    }
}


// ==========================================
// رفع الملف
// ==========================================

async function uploadFile() {

    const input =
        document.getElementById("fileInput");

    const status =
        document.getElementById("status");

    if (!input.files.length) {

        alert("اختار ملف أولاً");
        return;

    }

    const file = input.files[0];

    status.textContent = "جاري رفع الملف...";

    const fileName =
        Date.now() + "_" + file.name;

    const { error } =
        await supabaseClient
            .storage
            .from("files")
            .upload(fileName, file);

    if (error) {

        console.error(error);

        status.textContent =
            "حدث خطأ أثناء الرفع";

        return;
    }

    status.textContent =
        "✅ تم رفع الملف بنجاح";

    input.value = "";

    loadFiles();
}


// ==========================================
// عرض الملفات
// ==========================================

async function loadFiles() {

    const fileList =
        document.getElementById("fileList");

    const { data, error } =
        await supabaseClient
            .storage
            .from("files")
            .list();

    if (error) {

        fileList.innerHTML =
            "حدث خطأ أثناء تحميل الملفات";

        console.error(error);

        return;
    }

    fileList.innerHTML = "";

    if (!data || data.length === 0) {

        fileList.innerHTML =
            "لا توجد ملفات حالياً.";

        return;
    }

    data.forEach(file => {

        if (!file.name) return;

        const { data: urlData } =
            supabaseClient
                .storage
                .from("files")
                .getPublicUrl(file.name);

        const div =
            document.createElement("div");

        div.className = "file";

        div.innerHTML = `
            <div class="file-name">
                📄 ${escapeHTML(file.name)}
            </div>

            <a
                class="download"
                href="${urlData.publicUrl}"
                target="_blank"
                download
            >
                ⬇️ تحميل
            </a>

            <button
                class="delete"
                onclick="deleteFile('${encodeURIComponent(file.name)}')"
            >
                🗑️ حذف
            </button>
        `;

        fileList.appendChild(div);

    });
}


// ==========================================
// حذف الملف
// ==========================================

async function deleteFile(encodedName) {

    const fileName =
        decodeURIComponent(encodedName);

    const password =
        prompt("أدخل كلمة مرور الإدارة:");

    if (password !== ADMIN_PASSWORD) {

        alert("كلمة المرور خاطئة");
        return;

    }

    const confirmed =
        confirm("هل تريد حذف هذا الملف؟");

    if (!confirmed) return;

    const { error } =
        await supabaseClient
            .storage
            .from("files")
            .remove([fileName]);

    if (error) {

        alert("فشل حذف الملف");

        console.error(error);

        return;
    }

    alert("تم حذف الملف");

    loadFiles();
}


// ==========================================
// حماية بسيطة من HTML داخل أسماء الملفات
// ==========================================

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ==========================================
// تشغيل الموقع
// ==========================================

loadFiles();