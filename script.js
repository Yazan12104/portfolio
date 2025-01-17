// عناصر DOM
const mainContent = document.getElementById("main-content");
const homeBtn = document.getElementById("home-btn");
const designBtn = document.getElementById("design-btn");

// محتوى الواجهة الرئيسية
const homeContent = `
  <h1>أهلا وسهلا فيكن و رحب</h1>
      <p>هون في شي</p>
`;

// محتوى واجهة التصميم
const designContent = `
  <div id="toolbar">
    <div class="tool" data-shape="circle">Circle</div>
    <div class="tool" data-shape="rectangle">Rectangle</div>
    <div class="tool" data-shape="square">Square</div>
    <div class="tool" data-shape="text">Text</div>
    <input
      id="resize-slider"
      type="range"
      min="10"
      max="300"
      value="100"
      title="Resize Shape"
    />
    <div id="color-picker">
      <div
        class="color-swatch"
        style="background-color: red"
        data-color="red"
      ></div>
      <div
        class="color-swatch"
        style="background-color: blue"
        data-color="blue"
      ></div>
      <div
        class="color-swatch"
        style="background-color: green"
        data-color="green"
      ></div>
      <div
        class="color-swatch"
        style="background-color: yellow"
        data-color="yellow"
      ></div>
      <div
        class="color-swatch"
        style="background-color: black"
        data-color="black"
      ></div>
    </div>
    <button id="background-btn">Set Background</button>
  </div>

  <div id="workspace"></div>

  <button id="reset-btn">Reset</button>
`;

// وظائف إدارة الواجهة
designBtn.addEventListener("click", () => {
  mainContent.innerHTML = designContent;
  initializeDesignTool(); // تفعيل وظائف التصميم
});

homeBtn.addEventListener("click", () => {
  mainContent.innerHTML = homeContent;
});

// الوظائف الخاصة بأدوات التصميم
function initializeDesignTool() {
  const workspace = document.getElementById("workspace");
  const toolbar = document.getElementById("toolbar");
  const resizeSlider = document.getElementById("resize-slider");
  const resetBtn = document.getElementById("reset-btn");
  const backgroundBtn = document.getElementById("background-btn");
  let selectedElement = null;

  toolbar.addEventListener("click", (e) => {
    const shapeType = e.target.dataset.shape;
    if (shapeType) {
      const shape = document.createElement("div");
      shape.classList.add("shape", shapeType);
      shape.style.top = "50px";
      shape.style.left = "50px";
      shape.addEventListener("dblclick", () =>
        selectShapeForReplacement(shape)
      );
      workspace.appendChild(shape);
      attachDragHandlers(shape);
    }
  });

  function attachDragHandlers(element) {
    element.addEventListener("mousedown", (e) => {
      selectedElement = element;
      const offsetX = e.clientX - element.offsetLeft;
      const offsetY = e.clientY - element.offsetTop;

      function onMouseMove(event) {
        element.style.left = `${event.clientX - offsetX}px`;
        element.style.top = `${event.clientY - offsetY}px`;
      }

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", onMouseMove);
        },
        { once: true }
      );
    });
  }

  resizeSlider.addEventListener("input", (e) => {
    if (selectedElement) {
      const size = e.target.value;
      selectedElement.style.width = `${size}px`;
      selectedElement.style.height = `${size}px`;
    }
  });

  resetBtn.addEventListener("click", () => {
    workspace.innerHTML = "";
    workspace.style.backgroundImage = "";
  });

  backgroundBtn.addEventListener("click", () => {
    const url = prompt("Enter background image URL:");
    if (url) {
      workspace.style.backgroundImage = `url(${url})`;
      workspace.style.backgroundSize = "cover";
    }
  });
}

function selectShapeForReplacement(shape) {
  const galleryImages = JSON.parse(localStorage.getItem("galleryImages")) || [];
  if (galleryImages.length === 0) {
    alert("المعرض فارغ. قم بإضافة الصور أولاً.");
    return;
  }

  const imageSelectionMenu = document.createElement("div");
  imageSelectionMenu.id = "image-selection-menu";
  imageSelectionMenu.style.position = "absolute";
  imageSelectionMenu.style.top = `${shape.offsetTop}px`;
  imageSelectionMenu.style.left = `${shape.offsetLeft}px`;
  imageSelectionMenu.style.background = "#fff";
  imageSelectionMenu.style.border = "1px solid #ccc";
  imageSelectionMenu.style.padding = "10px";
  imageSelectionMenu.style.zIndex = "1000";
  imageSelectionMenu.style.display = "flex";
  imageSelectionMenu.style.gap = "10px";

  galleryImages.forEach((imgSrc) => {
    const imgElement = document.createElement("img");
    imgElement.src = imgSrc;
    imgElement.alt = "صورة المعرض";
    imgElement.style.width = "50px";
    imgElement.style.height = "50px";
    imgElement.style.objectFit = "cover";
    imgElement.style.cursor = "pointer";

    imgElement.addEventListener("click", () => {
      shape.style.backgroundImage = `url(${imgSrc})`;
      shape.style.backgroundSize = "cover";
      shape.style.backgroundPosition = "center";
      shape.classList.remove("text-box");
      document.body.removeChild(imageSelectionMenu);
    });

    imageSelectionMenu.appendChild(imgElement);
  });

  document.body.appendChild(imageSelectionMenu);

  // إغلاق القائمة عند النقر خارجها
  document.addEventListener(
    "click",
    (e) => {
      if (!imageSelectionMenu.contains(e.target) && e.target !== shape) {
        document.body.removeChild(imageSelectionMenu);
      }
    },
    { once: true }
  );
}

// ............................ // تفعيل زر المعرض وإضافة واجهة للمعرض
const galleryBtn = document.getElementById("gallery-btn");

// محتوى واجهة المعرض
const galleryContent = `
  <div id="gallery-container">
    <h2>معرض الصور</h2>
    <div id="gallery">
      <p id="empty-message">المعرض فارغ، قم بإضافة الصور.</p>
    </div>
    <input type="file" id="file-input" accept="image/*" style="display: none;" />
    <button id="add-image-btn">إضافة صورة</button>
  </div>
`;

// عرض واجهة المعرض عند الضغط على الزر
galleryBtn.addEventListener("click", () => {
  mainContent.innerHTML = galleryContent;
  initializeGallery();
});

// عرض واجهة المعرض عند الضغط على الزر
galleryBtn.addEventListener("click", () => {
  mainContent.innerHTML = galleryContent;
  initializeGallery();
});
// function initializeGallery
function initializeGallery() {
  const gallery = document.getElementById("gallery");
  const emptyMessage = document.getElementById("empty-message");
  const addImageBtn = document.getElementById("add-image-btn");
  const fileInput = document.getElementById("file-input");

  // تحميل الصور من LocalStorage
  loadImagesFromStorage();

  addImageBtn.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imgSrc = e.target.result;

        // إنشاء عنصر الصورة
        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.alt = "صورة مضافة";
        imgElement.classList.add("gallery-image");

        // إخفاء رسالة المعرض الفارغ عند إضافة الصور
        emptyMessage.style.display = "none";

        // إضافة الصورة إلى المعرض
        gallery.appendChild(imgElement);

        // حفظ الصورة في LocalStorage
        saveImageToStorage(imgSrc);
      };

      reader.readAsDataURL(file);
    }
  });

  function saveImageToStorage(imageSrc) {
    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    images.push(imageSrc);
    localStorage.setItem("galleryImages", JSON.stringify(images));
  }

  function loadImagesFromStorage() {
    let images = JSON.parse(localStorage.getItem("galleryImages")) || [];
    if (images.length > 0) {
      emptyMessage.style.display = "none";
      images.forEach((imgSrc) => {
        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;
        imgElement.alt = "صورة مضافة";
        imgElement.classList.add("gallery-image");
        gallery.appendChild(imgElement);
      });
    }
  }
}
// ...................
