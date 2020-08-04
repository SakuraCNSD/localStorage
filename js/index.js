var product = document.querySelector(".product").children[0];
var selected = document.querySelector(".selected").children[1];
var money = document.querySelector(".selected thead strong");
//页面刷新获取之前数据
var selectData = {};
function init() {
  selectData = Object.assign({}, selectData, JSON.parse(localStorage.getItem("shoppingCart")));
  createSelectDom();
}
init();
//请求数据
var data = "";
ajax("../js/data.json", (res) => {
  data = res;
  render(res);
  addEvent();
});
//通过数据生成元素
function render(data) {
  var str = "";
  data.forEach(item => {
    var color = "";
    item.list.forEach(item => {
      color += `<span data-id=${item.id}>${item.color}</span>`;
    });
    str += `<tr>
        <td>
          <img src=${item.list[0].img} alt="" />
        </td>
        <td>
          <p>${item.name}</p>
          <div class="color">
          ${color}
          </div>
        </td>
        <td>${item.list[0].price}.00元</td>
        <td>
          <span>-</span>
          <strong>0</strong>
          <span>+</span>
        </td>
        <td>
          <button>加入购物车</button>
        </td>
      </tr>`;
    product.innerHTML = str;
  });
}
//添加商品操作事件
function addEvent() {
  var trs = document.querySelectorAll(".product tr");
  for (var i = 0; i < trs.length; i++) {
    action(trs[i], i);
  }
  function action(tr, index) {
    var tds = tr.children,
      img = tr.children[0].children[0],
      imgSrc = img.getAttribute("src"),
      name = tds[1].children[0].innerHTML,
      colors = tds[1].children[1].children,
      price = parseFloat(tds[2].innerHTML),
      spans = tds[3].querySelectorAll("span"),
      strong = tds[3].querySelector("strong"),
      joinBtn = tds[4].children[0],
      selectedNum = 0;
    //颜色按钮点击功能
    var last = "",
      colorValue = "",
      colorId = "";
    for (var i = 0; i < colors.length; i++) {
      colors[i].onclick = function () {
        last && last != this && (last.className = "");
        this.className = this.className ? "" : "active";
        last = this;
        colorId = this.className ? this.getAttribute("data-id") : "";
        colorValue = this.className ? this.innerHTML : "";
        if (this.className) {
          imgSrc = data[index].list.filter(item => item.id === colorId)[0].img;
        } else {
          imgSrc = data[index].list[0].img;
        }
        img.setAttribute("src", imgSrc);
      }
    }
    //加减按钮事件
    spans[0].onclick = function () {
      selectedNum--;
      if (selectedNum < 0) {
        selectedNum = 0;
      }
      strong.innerHTML = selectedNum;
    }
    spans[1].onclick = function () {
      selectedNum++;
      strong.innerHTML = selectedNum;
    }
    //加入购物车
    joinBtn.onclick = function () {
      if (!colorValue) {
        alert("请选择颜色");
        return;
      }
      if (!selectedNum) {
        alert("请选择数量");
        return;
      }
      //selectData对象赋值
      selectData[colorId] = {
        id: colorId,
        name: name,
        color: colorValue,
        price: price,
        num: selectedNum,
        img: imgSrc,
        time: new Date().getTime()
      }
      localStorage.setItem("shoppingCart", JSON.stringify(selectData));
      strong.innerHTML = selectedNum = 0;
      last.className = "";
      img.src = data[index].list[0].img;
      createSelectDom();
    }
  }
}
//渲染购物车
function createSelectDom() {
  var sum = 0;
  var goods = Object.values(selectData);
  goods.sort((a, b) => {
    return b.time - a.time;
  });    
  selected.innerHTML = "";
  for (var i = 0; i < goods.length; i++) {
    var data = goods[i];
    sum += data.num * data.price;
    var str = `<tr>
    <td>
      <img src=${data.img} alt="" />
    </td>
    <td>
      <p>${data.name}</p>
    </td>
    <td>${data.color}</td>
    <td>${data.price * data.num}.00元</td>
    <td>×${data.num}</td>
    <td><button data-id=${data.id}>删除</button></td>
  </tr>`;
    selected.innerHTML += str;
  }
  money.innerHTML = sum + "元";
  del();
}
//删除按钮
function del() {
  var btns = document.querySelectorAll(".selected button");
  btns.forEach(item => {
    item.onclick = function(){
      var id = this.getAttribute("data-id");
      for (const key in selectData) {
        if(key === id){
          delete selectData[key];
        }
      }
      localStorage.setItem("shoppingCart", JSON.stringify(selectData));
      createSelectDom();
    }
  });
}
//Storage事件
window.addEventListener("storage", function(e){
  init();
});