import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m);
    }


    init() {
      
      setTimeout(()=>{
    var myMap;
var placemarkCollections = {};
var placemarkList = {};
const collectionItems = [...document.querySelectorAll(".collection-item")];

const shopList = collectionItems.reduce((acc, item) => {
  const city = item.dataset.city; // Получить имя города из атрибута data-city элемента коллекции
  const name = item.innerText; // Получить имя магазина из текста элемента коллекции
  const url = item.dataset.url;
  const coordinates = [
    parseFloat(item.dataset.latitude),
    parseFloat(item.dataset.longitude),
  ]; // Получить координаты магазина для данного города и имени

  // Найти объект города в массиве acc
  const cityObj = acc.find((cityObj) => cityObj.cityName === city);

  // Если город уже есть в массиве acc, добавить новый магазин в его список магазинов
  if (cityObj) {
    cityObj.shops.push({ coordinates, name, url });
  }
  // Иначе создать новый объект города с единственным магазином и добавить его в массив acc
  else {
    acc.push({
      cityName: city,
      
      shops: [{ coordinates, name, url }],
    });
  }

  return acc;
}, []);

console.log(shopList); // Вывести список магазинов в консоль



ymaps.ready(init);

function init() {
  // Создаем карту
  myMap = new ymaps.Map("map", {
    center: [55.7522200, 37.6155600],
    zoom: 11,
    controls: ["zoomControl"],
    // zoomMargin: [50],
  });


  for (var i = 0; i < shopList.length; i++) {
    // Добавляем название города в выпадающий список
    // $("select#cities").append(
    //   '<option value="' + i + '">' + shopList[i].cityName + "</option>"
    // );

    // Создаём коллекцию меток для города
    var cityCollection = new ymaps.GeoObjectCollection();



    for (var c = 0; c < shopList[i].shops.length; c++) {



      var shopInfo = shopList[i].shops[c];

      var shopPlacemark = new ymaps.Placemark(shopInfo.coordinates, {
        hintContent: shopInfo.name,
        balloonContent: shopInfo.name,
        url: shopInfo.url
      }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#imageWithContent',
        // Своё изображение иконки метки.
        iconImageHref: 'https://uploads-ssl.webflow.com/641020650b8f973d572415c3/644290833ed23269a4a42bec_Map%20Pin.svg',
        // Размеры метки.
        iconImageSize: [56, 56],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-24, -24],
        // Смещение слоя с содержимым относительно слоя с картинкой.
        iconContentOffset: [15, 15],
        // Макет содержимого.
        // iconContentLayout: MyIconContentLayout
    });

      if (!placemarkList[i]) placemarkList[i] = {};
      placemarkList[i][c] = shopPlacemark;

      // Добавляем метку в коллекцию
      cityCollection.add(shopPlacemark);


          

    }

    placemarkCollections[i] = cityCollection;

    // Добавляем коллекцию на карту
    myMap.geoObjects.add(cityCollection);

  
  

  }


  myMap.geoObjects.events.add('click', function (e) {
    // const target = event.target;
    // Объект на котором произошло событие
    e.preventDefault();
    var target = e.get('target');
    // window.location.href = target.properties.get('url');
    console.log(target.properties.get('url'))


    // const elem = document.querySelector("#ajax-container");

    // elem.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: "smooth"
    //   });
  
    // $(".popup-store").addClass('is-open')
    // const postURL = target.properties.get('url');
    // console.log(postURL);
    // loadDoc(postURL);
    // function loadDoc(postURL) {
    //   $("#ajax-container").load(postURL + " #modal-content");
    // }
  });  
  
  
  // $("select#cities").trigger("change");
}





// // Переключение города
// $(document).on("change", $("select#city"), function () {
//   var cityId = $("select#cities").val();

//   // Масштабируем и выравниваем карту так, чтобы были видны метки для выбранного города
//   myMap
//     .setBounds(placemarkCollections[cityId].getBounds(), {
//       checkZoomRange: true,
//     })
//     .then(function () {
//       if (myMap.getZoom() > 15) myMap.setZoom(15); // Если значение zoom превышает 15, то устанавливаем 15.
//     });

//   $("#shops").html("");
//   for (var c = 0; c < shopList[cityId].shops.length; c++) {
//     $("#shops").append(
//       '<li value="' +
//         shopList[cityId] +
//         '">' +
//         shopList[cityId].shops[c].name +
//         "</li>"
//     );
//   }


// // Клик на адрес
// $(document).on("click", "#shops li", function () {
//   var cityId = $("select#cities").val();
//   var shopId = $(this).val();

//   placemarkList[cityId][shopId].events.fire("click");
// });





// var geolocation = ymaps.geolocation;
 
//     geolocation.get({
//         // Выставляем опцию для определения положения по ip
//         provider: 'yandex',
//         // Карта автоматически отцентрируется по положению пользователя.
//         mapStateAutoApply: true,
//         // Включим автоматическое геокодирование результата.
//         autoReverseGeocode: true
//     }).then(function (result) {
 
//         // Выведем результат геокодирования.
//         myMap.geoObjects.add(result.geoObjects);
 
//         var address = result.geoObjects.get(0).properties.get('text');
//         document.getElementById('address').innerText = address;
 
//         // Выведем в консоль результат геокодирования.
//         console.log(result.geoObjects.get(0).properties.get('metaDataProperty'));
 
//     });


    

//
//
//
//
//
//
//
//
//
//
//

$(".open-map").click(function () {
  //Забираем координаты из кнопки
  var loc = $(this).attr("data-coord");
  loc = JSON.parse(loc);
  //Увеличиваем карту до нужного размера
  myMap.setZoom(16, { smooth: true, centering: true });
  //Перемещаем карту к нужной метке
  myMap.panTo(loc);
  // placemarkList[cityId][shopId].events.fire("click");
});

//
//
//
//
//
//
      }, 50)
        

};


    
}
