import { module } from 'modujs';

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
      let activePlacemark;

      // Переменные для информации о шопе на мобилке
      const mobileShopInfoTitle = document.querySelector('.address_item-mobile-title')
      const mobileShopInfoStreet = document.querySelector('.address_item-street')
      const mobileShopInfoPhone = document.querySelector('.address_item-phone')
      const mobileShopInfoWorkTime = document.querySelector('.address_work-time-current')
      const mobileShopInfoOpening = document.querySelector('.adress__item-tag')
      const shopInfoContainer = document.querySelector('.address_item-container')
      const body = document.querySelector('body')

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

            const shopPlacemark = new ymaps.Placemark(coordinates, {
              hintContent: shopName,
              hasBalloon: false,
              url: shopInfo.url
            }, {
              // Опции.
              // Необходимо указать данный тип макета.
              iconLayout: 'default#imageWithContent',
              // Своё изображение иконки метки.
              iconImageHref: 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/6449f3ca43a6861b851a4938_vilet-pin.svg',
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

              // Таймауты - костыль из-за эффекта cmsfilter
              setTimeout(() => {
                const currentShopEl = document.getElementById(shopName)?.parentNode

                if (currentCityEl.classList.contains('fs-cmsfilter_active')) {
                  shopsCollection.forEach(el => {
                    el.attributes['data-city'] !== currentShopEl?.attributes['data-city']
                      && el.classList.remove('active')
                  })
                }

                // Карточка шопа на мобилке
                shopInfoContainer.classList.add('address_item-container--active')
                mobileShopInfoTitle.textContent = currentShopEl.attributes['data-shop'].value
                mobileShopInfoStreet.textContent = currentShopEl.attributes['data-address'].value
                mobileShopInfoPhone.textContent = currentShopEl.attributes['data-phone'].value
                mobileShopInfoWorkTime.innerHTML = currentShopEl.querySelector('.address_work-time').outerHTML
                currentShopEl.attributes['data-opening'].value === 'УЖЕ ОТКРЫТ'
                    ? mobileShopInfoOpening.classList.remove('adress__item-tag--active')
                    : mobileShopInfoOpening.classList.add('adress__item-tag--active')
              }, 200)

              if (!currentCityEl.classList.contains('fs-cmsfilter_active')) {
                currentCityEl.click()
              }

              myMap.setZoom(16, { smooth: true, centering: true });
              setTimeout(() => myMap.panTo(coordinates, {
                flying: false
              }), 50)

              setTimeout(() => {
                const currentShopEl = document.getElementById(shopName)?.parentNode

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

          cityCollection.events.add('click', function(e) {
            if (activePlacemark) {
              activePlacemark.options.set('iconImageHref', 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/6449f3ca43a6861b851a4938_vilet-pin.svg')
            }
            activePlacemark = e.get('target');
            activePlacemark.options.set('iconImageHref', 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/645ada30feec4875e28ff7a4_vilet-pin--active.svg')
          })
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

      // Кнопка закрытия информации о шопе на мобилке
      const mobileShopInfoCloseBtn  = document.querySelector('.address__close-btn')

      mobileShopInfoCloseBtn.addEventListener('click', () => {
        const shopInfo = document.querySelector('.address_item-container')
        shopInfo.classList.remove('address_item-container--active')
      })

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
        myMap.panTo(loc, { flying: false });

        // И смена цвета меток в обратную сторону
        const myGeoQuery = ymaps.geoQuery(myMap.geoObjects);

        myGeoQuery.search(function(element) {
          const elementCenter = element.geometry.getCoordinates();

          if (elementCenter[0] === loc[0] && elementCenter[1] === loc[1]) {
            if (activePlacemark) {
              activePlacemark.options.set('iconImageHref', 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/6449f3ca43a6861b851a4938_vilet-pin.svg')
            }
            activePlacemark = element
            activePlacemark.options.set('iconImageHref', 'https://uploads-ssl.webflow.com/640dfc44890e1e178b3b2f19/645ada30feec4875e28ff7a4_vilet-pin--active.svg')
            return true;
          } else {
            return false;
          }
        });
        // placemarkList[cityId][shopId].events.fire("click");

        // Карточка шопа на мобилке
        shopInfoContainer.classList.add('address_item-container--active')
        mobileShopInfoTitle.textContent = $(this).parents(".store-locator__list-item").attr('data-shop')
        mobileShopInfoStreet.textContent = $(this).parents(".store-locator__list-item").attr('data-address')
        mobileShopInfoPhone.textContent = $(this).parents(".store-locator__list-item").attr('data-phone')
        mobileShopInfoWorkTime.innerHTML = $(this).parents(".store-locator__list-item").find('.address_work-time').prop('outerHTML')
        $(this).parents(".store-locator__list-item").attr('data-opening') === 'УЖЕ ОТКРЫТ'
            ? mobileShopInfoOpening.classList.remove('adress__item-tag--active')
            : mobileShopInfoOpening.classList.add('adress__item-tag--active')
        body.classList.add('map-show')
      });

      // Убираем выделение после клика по городу
      $(document).on("click", ".change-city", function () {
        $(".open-map").parents(".store-locator__list-item").removeClass("active");
      });
    }, 50)
  };
}
