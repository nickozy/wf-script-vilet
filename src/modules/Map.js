import { module } from 'modujs';

// const getPlacemarkContent = (active) => {
//   return ymaps.templateLayoutFactory.createClass(
//       `<svg width="32" height="32" view-box="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <rect x="0.5" y="0.500488" width="31" height="31" rx="15.5" fill="url(#paint0_linear_387_4228)"/>
//         <path d="M10.7779 9.00049L15.9984 23.3205H16.0441L21.2208 9.00049H22.8405L16.8768 25.0005H15.0982L9.1582 9.00049H10.7779Z" fill="#231F20"/>
//         <rect x="0.5" y="0.500488" width="31" height="31" rx="15.5" stroke="#231F20"/>
//         <defs>
//             <linear-gradient x1="16" y1="0.000488281" x2="16" y2="32.0005" gradient-units="userSpaceOnUse">
//             <stop stop-color="#F7D7E5" />
//             <stop offset="1" stop-color="#F9D4CC" />
//             </linear-gradient>
//         </defs>
//       </svg>`,
//   )
// }

export default class extends module {
  constructor(m) {
    super(m);
    this.events = {
      click: {
        current: 'current'
      }
    }
  }

  // current(){
  //   const el = this.el
  //   $('.store-locator__list-item').removeClass("active")
  //       el.classList.add('active');
  //     }

  init() {
    setTimeout(() => {
      var myMap;
      var placemarkCollections = {};
      var placemarkList = {};
      const collectionItems = [...document.querySelectorAll(".collection-item")];

      const cityList = collectionItems.reduce((acc, item) => {
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

      console.log(cityList); // Вывести список шопов в консоль

      ymaps.ready(init);

      function init() {
        // Создаем карту
        myMap = new ymaps.Map("map", {
          center: [55.7522200, 37.6155600],
          zoom: 11,
          controls: ["zoomControl"],
          // zoomMargin: [50],
        });

        for (var i = 0; i < cityList.length; i++) {
          // Добавляем название города в выпадающий список
          // $("select#cities").append(
          //   '<option value="' + i + '">' + shopList[i].cityName + "</option>"
          // );

          // Создаём коллекцию меток для города
          var cityCollection = new ymaps.GeoObjectCollection();

          for (var c = 0; c < cityList[i].shops.length; c++) {
            var shopInfo = cityList[i].shops[c];
            const cityName = cityList[i].cityName
            const shopName = shopInfo.name
            const coordinates = shopInfo.coordinates

            var shopPlacemark = new ymaps.Placemark(coordinates, {
              hintContent: shopInfo.name,
              balloonContent: shopInfo.name,
              hasBalloon: false,
              url: shopInfo.url
            }, {
              // Опции.
              // Необходимо указать данный тип макета.
              iconLayout: 'default#imageWithContent',
              // Своё изображение иконки метки.
              iconImageHref: 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/6449f3ca43a6861b851a4938_vilet-pin.svg',
              // iconLayout: getPlacemarkContent(false),
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

            shopPlacemark.events.add('click', function () {
              // Старайся добавлять в массивы id
              const shopsCollection = document.querySelectorAll('.store-locator__list-item')
              const currentCityEl = document.getElementById(cityName)
              const currentShopEl = document.getElementById(shopName)?.parentNode

              if (currentCityEl.classList.contains('fs-cmsfilter_active')) {
                shopsCollection.forEach(el => {
                  el.attributes['data-city'] !== currentShopEl.attributes['data-city']
                    && el.classList.remove('active')
                })
              }

              currentCityEl.click()

              myMap.setZoom(16, { smooth: true, centering: true });
              setTimeout(() => myMap.panTo(coordinates), 50)

              setTimeout(() => {
                currentShopEl.classList.add('active')
                currentCityEl.classList.add('fs-cmsfilter_active')
              }, 200)
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

        // myMap.geoObjects.events.add('click', function (e) {
          // const target = event.target;
          // Объект на котором произошло событие
          // e.preventDefault();
          // var target = e.get('target');
          // window.location.href = target.properties.get('url');
          // console.log(e)
          // const currentCity = document.getElementById()
          // console.log(currentCity)
          // ListItem???.classList.add('active')
          // City???.classList.add('fs-cmsfilter_active')

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
        // });

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

      // Работает также на элементах которых еще нет в dom!
      $(document).on("click", ".open-map", function () {
        //Забираем координаты из кнопки

        $(".open-map").parents(".store-locator__list-item").removeClass("active");
        $(this).parents(".store-locator__list-item").addClass("active");
        var loc = $(this).attr("data-coord");
        loc = JSON.parse(loc);
        //Увеличиваем карту до нужного размера
        myMap.setZoom(16, { smooth: true, centering: true });
        //Перемещаем карту к нужной метке
        myMap.panTo(loc);
        // placemarkList[cityId][shopId].events.fire("click");
      });
    }, 50)
  };
}
