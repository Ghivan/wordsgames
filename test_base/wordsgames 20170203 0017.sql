﻿--
-- Скрипт сгенерирован Devart dbForge Studio for MySQL, Версия 7.2.53.0
-- Домашняя страница продукта: http://www.devart.com/ru/dbforge/mysql/studio
-- Дата скрипта: 03.02.2017 0:17:18
-- Версия сервера: 5.7.17-0ubuntu0.16.04.1
-- Версия клиента: 4.1
--


--
-- Описание для базы данных wordsgames
--

-- 
-- Отключение внешних ключей
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Установить режим SQL (SQL mode)
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Установка кодировки, с использованием которой клиент будет посылать запросы на сервер
--
SET NAMES 'utf8';

-- 
-- Установка базы данных по умолчанию
--
--
-- Описание для таблицы dictionary
--
CREATE TABLE dictionary (
  word VARCHAR(255) NOT NULL COMMENT 'Слово',
  definition TEXT DEFAULT NULL COMMENT 'Значение слова',
  UNIQUE INDEX word (word)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 290
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Толковый словарь'
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы games
--
CREATE TABLE games (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL COMMENT 'Название игры',
  rules MEDIUMTEXT NOT NULL COMMENT 'Правила игры',
  path VARCHAR(255) NOT NULL COMMENT 'Путь к папке с игрой',
  author VARCHAR(255) NOT NULL COMMENT 'Разработчик',
  status ENUM('development','production') NOT NULL DEFAULT 'development' COMMENT 'Статус (в разработке/опубликована)',
  PRIMARY KEY (id)
)
ENGINE = INNODB
AUTO_INCREMENT = 5
AVG_ROW_LENGTH = 4096
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Каталог игр'
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы players
--
CREATE TABLE players (
  id INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id игрока',
  login VARCHAR(255) NOT NULL COMMENT 'Логин',
  password VARCHAR(255) NOT NULL COMMENT 'Пароль',
  email VARCHAR(255) NOT NULL DEFAULT '' COMMENT 'Электронная почта',
  role ENUM('admin','developer','user') NOT NULL DEFAULT 'user' COMMENT 'Роль пользователя',
  avatar VARCHAR(255) NOT NULL DEFAULT '/files/images/players/no_avatar.png' COMMENT 'Путь к аватару игрока',
  exp INT(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Набранный игроком опыт',
  level INT(2) UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Текущий уровень игрока',
  PRIMARY KEY (id),
  UNIQUE INDEX log (login)
)
ENGINE = INNODB
AUTO_INCREMENT = 66
AVG_ROW_LENGTH = 1489
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Информация об игроках'
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы wfw_levels
--
CREATE TABLE wfw_levels (
  level INT(2) NOT NULL COMMENT 'Номер уровня',
  word VARCHAR(255) NOT NULL COMMENT 'Слово уровня',
  wordVariants TEXT NOT NULL COMMENT 'Варианты возможных слов',
  missionUnique VARCHAR(10) NOT NULL COMMENT 'Уникальная миссия для уровня (формат записи: ''а'':3)',
  UNIQUE INDEX level (level),
  UNIQUE INDEX word (word)
)
ENGINE = INNODB
AVG_ROW_LENGTH = 5461
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Уровни игры "слова из слова"'
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы wfw_levelsPassed
--
CREATE TABLE wfw_levelsPassed (
  pl_id INT(11) NOT NULL COMMENT 'id игрока',
  word VARCHAR(255) NOT NULL COMMENT 'Слово уровня',
  foundWords MEDIUMTEXT DEFAULT NULL COMMENT 'Найденные слова',
  star1status TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Информация о получении бонуса',
  star2status TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Информация о получении бонуса',
  star3status TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Информация о получении бонуса',
  PRIMARY KEY (pl_id, word),
  INDEX word (word),
  CONSTRAINT wfw_levelsPassed_ibfk_1 FOREIGN KEY (pl_id)
    REFERENCES players(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT wfw_levelsPassed_ibfk_2 FOREIGN KEY (word)
    REFERENCES wfw_levels(word) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Информация о прохождении игроками уровней'
ROW_FORMAT = DYNAMIC;

--
-- Описание для таблицы wfw_scoreTable
--
CREATE TABLE wfw_scoreTable (
  pl_id INT(11) NOT NULL,
  score INT(11) NOT NULL DEFAULT 0 COMMENT 'Количество набранных в игре "слова из слова" очков',
  lastLevel INT(2) NOT NULL DEFAULT 1 COMMENT 'Последний сыгранный уровень',
  PRIMARY KEY (pl_id),
  INDEX lastLevel (lastLevel),
  CONSTRAINT wfw_scoreTable_ibfk_1 FOREIGN KEY (pl_id)
    REFERENCES players(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT wfw_scoreTable_ibfk_2 FOREIGN KEY (lastLevel)
    REFERENCES wfw_levels(level) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE = INNODB
CHARACTER SET utf8
COLLATE utf8_general_ci
COMMENT = 'Таблица результатов игроков'
ROW_FORMAT = DYNAMIC;

DELIMITER $$

--
-- Описание для функции countExp
--
CREATE FUNCTION countExp(`lvl` INT)
  RETURNS int(11)
  SQL SECURITY INVOKER
  NO SQL
  COMMENT 'Подсчитывает необходимое количество опыта для уровня'
BEGIN
  DECLARE exp int;
SET exp = FLOOR(1000 * (POW(1.1, lvl) - 1));
RETURN exp;
END
$$

DELIMITER ;

-- 
-- Вывод данных для таблицы dictionary
--
INSERT INTO dictionary VALUES
('аак', 'Одномачтовое плоскодонное судно, использовавшееся на Нижнем Рейне для перевозки вин.'),
('абак', 'Счётная доска, применявшаяся для арифметических вычислений приблизительно с IV века до н. э. в Древней Греции, Древнем Риме.'),
('аборт', 'Медикаментозное или хирургическое вмешательство, с помощью которого производится прерывание беременности.'),
('адрон', 'Элементарная частица, состоящая из кварков и участвующая в сильных взаимодействиях.'),
('аил', 'У киргизов и алтайцев в прошлом посёлок кочевого или полукочевого типа, обычно состоявший из родственников различных степеней. У алтайцев так называлось и отдельное жилище (юрта или шалаш) с усадьбой.'),
('аир', 'Многолетнее травянистое растение, с толстым корневищем, диаметром до Зсм, ползучее, ветвистое, несколько сплюснутое, с многочисленными тонкими, шнуровидными корнями.'),
('аист', 'Крупная длинноногая перелётная птица с длинным прямым клювом.'),
('акат', 'Парусный корабль крейсерского назначения.'),
('акр', 'Земельная мера в Англии и Америке, равная 4047 кв. м.'),
('акт', 'Единичное действие, а также поступок, проявление действий.'),
('актор', 'действующий субъект (индивидуальный или коллективный); индивид, социальная группа, организация, институт, общность людей, совершающих действия, направленные на других)'),
('алан', 'Представитель ираноязычного народа, традиционно населявшего северный Кавказ, Причерноморье.'),
('аланин', 'Ациклическая аминокислота, широко распространённая в живой природе.'),
('алас', 'Прогалина, лужайка в лесу.'),
('али', 'В грузинской мифологии злые духи, вредящие роженицам, новорождённым, одиноким путникам и другим людям. Могли быть как мужского, так и женского пола. У них устрашающий вид (зубы из меди, след стеклянный, волосы запачканы).'),
('альт', '1) Низкий женский или детский голос, а также певец (певица) с таким голосом. 2) Музыкальный смычковый инструмент несколько больше скрипки или медный духовой инструмент.'),
('анид', 'Синтетическое полиамидное волокно, аналогичное нейлону.'),
('анион', 'Отрицательно заряженный ион, одноатомная или многоатомная частица, несущая отрицательный электрический заряд '),
('анис', 'Однолетнее травянистое растение с пахучими семенами сладковато-пряного вкуса, содержащими маслянистые вещества.'),
('анналист', 'Историк, описывавший события в хронологической последовательности, по годам.'),
('аннат', 'Единовременный сбор в пользу папской казны с лиц, получивших вакантный церковный бенефиций.'),
('аннона', 'Род деревьев и кустарников семейства анноновых. Около 110 видов, в тропиках и субтропиках Америки, Африки. Многие американские виды разводят ради съедобных плодов.'),
('аноа', 'Карликовый буйвол (занесен в Красную книгу)'),
('анод', 'Положительный электрод.'),
('анонс', 'Предварительное объявление (о спектакле, концерте, лекции и т. п.).'),
('антоциан', 'Пигмент растений, окрашивающий цветки, плоды, листья.'),
('аорта', 'Главная, самая крупная артерия, питающая артериальной кровью органы тела.'),
('ара', 'Род птиц подсемейства настоящие попугаи семейства попугаевых.'),
('араб', 'Представитель одного из семитских народов, издавна населявших Ближний Восток и Северную Африку.'),
('арак', 'Ароматизированный анисом крепкий алкогольный напиток, распространённый на Ближнем Востоке и Центральной Азии.'),
('арат', 'Крестьянин-скотовод'),
('арба', 'Телега (двухколёсная — в Крыму, на Кавказе и в Средней Азии или длинная четырёхколёсная — на Украине).'),
('арка', 'Перекрытие дугообразной формы.'),
('асцит', 'Скопление жидкости в брюшной полости; брюшная водянка (в медицине).'),
('атлас', 'Сборник таблиц, географических карт и т. п.'),
('бак', '1. Носовая часть верхней палубы корабля. 2. Большой сосуд для жидкостей.'),
('бакор', 'Огнеупорныйматериал с высоким содержанием диоксида циркония (33-45 %) и глинозема (50%). Применяется для кладки стекловаренных печей.'),
('бакота', 'Группа племён, населяющих бассейн верхнего течения р. Огове в Габоне и Народной Республике Конго.'),
('бакт', 'Внесистемная единица бактерицидного потока излучения.'),
('бар', 'Маленький ресторан, где обычно пьют и едят у стойки.'),
('бара', '(старин.) То же, что болото.'),
('барак', 'Деревянное здание лёгкой постройки, предназначенное для временного жилья.'),
('барк', 'Большое парусное судно с прямыми парусами на всех мачтах, кроме кормовой (бизань-мачты), несущей косое парусное вооружение.'),
('барка', 'Деревянная баржа.'),
('бат', 'Денежная единица Таиланда.'),
('батрак', 'Наемный сельскохозяйственный рабочий в помещичьем или кулацком хозяйстве.'),
('боа', '1. Крупная южноамериканская змея из сем. удавов. 2. Женский широкий шейный шарф из меха или перьев.'),
('бок', '1. Правая или левая сторона туловища, тела. 2. Одна из сторон предмета, кроме верха и низа, передней и задней сторон его.'),
('бор', '1. Хвойный лес.'),
('бора', 'Местный сильный (до 40 - 60 м/с) холодный ветер в некоторых приморских районах, где невысокиегорные хребты граничат с теплым морем.'),
('борт', 'Боковая стенка судна.'),
('бот', 'Небольшое парусное, гребное или моторное судно.'),
('бра', 'Подсвечник или держатель для лампы, прикрепляемый к стене.'),
('брак', '1. Супружеские отношения, законно оформленные. 2. Изъян (в товаре).'),
('брат', 'Сын в отношении к другим детям одних родителей.'),
('брокат', 'Тяжелая шелковая ткань, вышитая или вытканная золотыми или серебряными нитями.'),
('вено', 'Выкуп, который в Древней Руси и некоторых европейских государствах периода средневековья выплачивался женихом за невесту.'),
('вес', '1. Тяжесть кого- (чего-) нибудь, определяемая какой-нибудь мерой. 2. Влияние, авторитет.'),
('вест', 'Запад, западное направление (в мореплавании и метеорологии).'),
('весть', 'Известие, сообщение.'),
('весь', '(стар.). Селение, деревня.'),
('вето', 'Запрет.'),
('вонь', 'Дурной запах.'),
('дан', 'В восточных единоборствах: степень мастерства в овладении искусством боя.'),
('данио', 'Род рыб семейства карповых'),
('дао', 'Одна из основных категорий китайской философии, «путь», по которому должен следовать окружающий мир и все люди, путь совершенствования в выполнении совокупности морально-этических норм.'),
('дар', '1) Подарок. 2) Способность, талант.'),
('дари', 'Один из двух (наряду с пушту) главных литературных языков Афганистана, принадлежащий к иран-ской группе индоевропейской семьи языков.'),
('дина', 'В механике: единица силы, равная силе, сообщающей массе в один грамм ускорение в один сантиметр в секунду.'),
('динар', 'Денежная единица в Югославии и Ираке.'),
('дно', '1) Почва под водой водоёма. 2) Нижняя часть углубления, выемки.'),
('дон', 'Титул в некоторых странах Европы.'),
('дорн', ' инструмент для поверхностного дорнования (вид обработки заготовок без снятия стружки).'),
('дрон', 'Беспилотный летательный аппарат военного назначения.'),
('енот', 'Пушной зверь с тёмно-жёлтым ценным мехом.'),
('идо', 'Один из искусственных международных языков, представляющий собой разновидность эсперанто.'),
('илот', 'В древней Спарте земледелец, находящийся на промежуточном положении между крепостными и рабами.'),
('инь', 'В древнекитайской мифологии и натурфилософии — символ созидательного единства противоположностей во Вселенной.'),
('иод', 'Химический элемент.'),
('иол', 'Разновидность двухмачтового парусного судна с косыми парусами.'),
('ион', 'Электрически заряженная частица, образующаяся при отрыве или присоединении одного или нескольких электронов (или других заряженных частиц частиц) к атому, молекуле, радикалу и другому иону.'),
('ионол', 'Порошок жёлтого цвета, применяется как антиокислитель в производстве пищевых продуктов, смазочных масел, каучуков и др.'),
('ирод', 'Крайне жестокий человек, подобный библейскому царю Ироду.'),
('кара', 'Наказание, возмездие.'),
('карат', 'Мера веса алмазов и других драгоценных камней, равная 0,2 г.'),
('карт', 'Гоночный микролитражный автомобиль без кузова.'),
('карта', 'Чертёж земной поверхности (или звёздного неба).'),
('кат', 'Палач, экзекутор.'),
('ката', 'Формальные упражнения в боевых искусствах, имитирующие бой с одним или несколькими противниками.'),
('катар', 'Воспаление слизистой оболочки какого-нибудь органа.'),
('коб', 'Африканская антилопа рода водяных козлов семейства полорогих.'),
('кобра', 'Ядовитая змея жарких стран с пятнами позади головы, очковая змея.'),
('кор', '(физ.) Сердцевина, центральная часть (вихря)'),
('кора', 'Наружная, над древесиной, часть стволов, стеблей и корней древесных растений.'),
('корт', 'Площадка для тенниса.'),
('кот', 'Самец кошки.'),
('краб', 'Род морского рака.'),
('крот', 'Млекопитающее из отряда насекомоядных, живущее под землёй, а также мех его.'),
('ланита', 'То же, что щека (устаревшее слово)'),
('лантан', 'Химический элемент '),
('лань', 'Животное из семейства оленей, отличающееся быстротой бега и стройностью.'),
('лао', 'Этническая группа в Юго-Восточной Азии, большинство представителей которой проживают в Таиланде (около 16 миллионов, 25 % населения страны) и Лаосе (около 3 миллионов, 50 % населения страны). В Мьянме насчитывается 25 тыс.'),
('ласт', 'Укороченная конечность водных животных, птиц (тюленей, моржей, пингвинов и т. п.), пальцы которой соединены кожной перепонкой.'),
('лат', 'Денежная единица в Латвии.'),
('лата', '1) Отличительный знак евреев в Третьем рейхе. 2) Психическое расстройство жителей Юго-Восточной Азии.'),
('лиана', 'Южное вьющееся или лазящее цепкое растение.'),
('лино', 'Сорт белого тонкого льняного полотна, батиста. (устаревшее слово)'),
('линт', 'Короткое - до 15 мм - волокно, получаемое после отделения длинных волокон.'),
('линь', 'Пресноводная рыба из семейства карповых с толстым слизистым телом.'),
('лис', '1) Самец лисицы. 2) Хитрый, льстивый человек.'),
('лиса', 'Хищное пушистое млекопитающее рода лисиц.'),
('лист', '1) Орган воздушного питания и газообмена растений в виде тонкой, обычно зелёной пластинки. 2) Тонкий плоский кусок, пласт какого-нибудь материала. 3) Единица исчисления печатного текста '),
('лит', 'Денежная единица Литвы.'),
('лицо', 'Передняя часть головы человека.'),
('лоно', '1) а) (устаревшее слово) Грудь (как символ материнства, нежности, ласки), чрево, чресла женщины. б) (переносное значение) То, что является приютом, прибежищем для кого-либо, чего-либо. 2)(переносное значение) То, что окружает кого-либо, что-либо (о поверхности воды, недрах земли и т.п.).'),
('лосина', 'Мясо лося.'),
('лось', 'Крупное животное из семейства оленей с ветвистыми широкими рогами.'),
('лосьон', 'Туалетная жидкость для ухода за кожей.'),
('лот', 'Партия, стандартное количество ценных бумаг или товаров, допускаемое к биржевым торгам как единое целое.'),
('лото', 'Игра на особых картах с номерами или картинками, которые закрываются фишками.'),
('лотос', 'Южное водяное растение из семейства кувшинковых с красивыми крупными цветками.'),
('надир', 'Точка небесной сферы, находящаяся под горизонтом, противоположная зениту.'),
('нанос', 'Земля, песок, нанесённые водой, ветром.'),
('наос', 'Главное помещение (святилище) античного храма, где находилось скульптурное изображение божества.'),
('нард', '1) Травянистое растение семейства валерьяновых с мясистым и пахучим корневищем и мелкими цветками. 2) Ароматическое вещество, добываемое из такого растения.'),
('народ', 'Население государства, жители страны.'),
('нас', 'Cмесь махорочного табака, золы, извести, хлопкового или кунжутного масла, жевание которого было распространено как вредная привычка среди населения ряда стран Азии и Среднеазитских республик СССР; обладает онкогенными свойствами.'),
('наст', 'Твёрдая корка на снегу после короткой оттепели.'),
('настил', 'Поверхность из досок (или другого материала), настланных на чём-нибудь.'),
('нацист', '1) Приверженец нацизма. 2) Член гитлеровской фашистской партии.'),
('нилот', 'Группа африканских племен, заселяющих территорию по верхнему течению реки Нила.'),
('нит', 'Наименование единицы яркости, входящей в Международную систему единиц (СИ)'),
('нить', 'Гибкий, тонкий и продолговатый объект, чья длина в разы превосходит толщину. Например, шелковая нить.'),
('ноа', 'Археологическая культура позднего бронзового века (конец второго тысячелетия до нашей эры) в Румынии и западных районах Украины. Названа по могильнику в пригороде г. Брашов (Румыния). '),
('новь', '1) Никогда не паханная земля; целина. 2) Хлеб нового урожая. 3) перен. Что-л. новое, вновь появившееся, возникшее.'),
('ноо', 'Один из жанров традиционного театра Японии. Вначале был народным, к XIV—XV вв. стал театром феодальной знати и военной аристократии. Включает музыку, танец, драму. Декорации условны, грим отсутствует, главные персонажи носят маски'),
('нора', 'Углубление под землёй с ходом наружу, вырытое животным и служащее ему жилищем.'),
('норд', 'Север, северное направление; северный ветер.'),
('нос', 'Орган обоняния.'),
('нота', 'Графическое изображение музыкального звука, а также сам звук.'),
('нотис', 'Извещение о полной готовности судна к погрузке или выгрузке.'),
('нотница', 'Библиотека нот.'),
('ночь', 'Часть суток от вечера до утра.'),
('обкат', 'Действие по глаголу обкатать и обкатить.'),
('обрат', 'Молоко после удаления из него жиров сепаратором.'),
('овен', 'Первый знак зодиака, представитель стихии огня под покровительством Марса'),
('овес', 'Яровой злак, зёрна которого обычно идут на корм лошадям, а также на крупу.'),
('ода', 'лирическое произведение, посвященное изображению крупных исторических событий или лиц, говорящее о значительных темах религиозно-философского содержания, насыщенное торжественным.'),
('окат', 'Округлая форма чего-либо; округлость.'),
('окра', '(ботан.) Растение семейства мальвовых, овощная культура широко используемая в восточной кухне.'),
('онанист', 'Человек, занимающийся мастурбацией.'),
('оолит', 'Круглозернистый известняк, икряник.'),
('ооциста', 'Оплодотворенная яйцеклетка.'),
('ооцит', 'Женская половая клетка в период ее роста и созревания'),
('орда', '1) В древности у тюркских кочевых народов: род государственного объединения первонач. становище кочевых племён. 2) Толпа, скопище, банда.'),
('орт', '(матем.) Вектор единичной длины'),
('оса', 'Хищное жалящее насекомое с жёлто-чёрным брюшком.'),
('осанна', 'Торжественное молитвенное восклицание (краткая молитва), изначально являвшееся хвалебным возгласом. Моление о помощи.'),
('осень', 'Пора года.'),
('осина', 'Лиственное дерево из семейства ивовых.'),
('осот', 'Крупная сорная колючая трава.'),
('ост', '1) а) Название востока в мореплавании и метеорологии. б) Восточный ветер. 2) Один из четырех главных румбов в компасе, делящих горизонт на четыре части.'),
('остол', 'Шест для управления нартами.'),
('ость', '1) Тонкая длинная щетинка у злаков, трав. 2) Длинный жёсткий волос в мехе.'),
('ось', '1) Воображаемая прямая линия, вокруг которой вращается некоторое тело или которая определяет вращение.  2) Деревянный или металлический стержень, помещенный в центре вращающейся части машины.'),
('отара', 'Большой гурт овец.'),
('отвес', 'Небольшой груз на нитке для выверки вертикального положения.'),
('отсев', 'То, что осталось после просеивания, высевки. '),
('очес', '1) Очистка волокнистого материала (хлопка, шерсти, льна и т.п.) посредством чесания. 2) Отходы при такой очистке.'),
('раб', 'Зависимый, угнетённый в условиях эксплуататорского общества человек.'),
('работа', 'Занятие, труд.'),
('рад', 'Внесистемная единица поглощенной дозы излучения. '),
('радио', 'Устройство для приёма электромагнитных волн, передаваемых специальными станциями.'),
('радон', 'Радиоактивный химический элемент, используемый в технике и медицине.'),
('рак', '1. Покрытое панцирем пресноводное или морское животное с клешнями и брюшком, называемым обычно шейкой. 2. Род злокачественной опухоли.'),
('ракат', 'Цикл мусульманских молитвенных формул, произносимых на арабском языке и сопровождаемых определенными молитвенными позами и движениями.'),
('рани', 'Жена раджи; княгиня.'),
('роба', 'Грубая рабочая одежда.'),
('род', 'Группа людей, связанных общностью происхождения по материнской или отцовской линии.'),
('рок', '1. Ритмически чёткая энергичная музыка, исполняемая на электроинструментах. 2. То же, что судьба (обычно несчастливая).'),
('рот', 'Полость между верхней и нижней челюстями, имеющая отверстие в нижней части лица.'),
('рота', 'Подразделение в пехоте, в некоторых других родах войск, входящее обычно в состав батальона.'),
('салат', '1) Травянистое овощное растение, листья к-рого идут в пищу в сыром виде. 2) Холодное кушанье из нарезанных кусочками овощей, яиц, мяса или рыбы с какой-нибудь приправой.'),
('салинон', 'Плоская геометрическая фигура, образованная четырьмя полуокружностями.'),
('сало', 'Жировое отложение в теле животного, а также продукт из этого вещества.'),
('салон', 'Помещение для выставок, демонстрации товаров и т. п.'),
('сальто', 'Прыжок с перевёртыванием тела в воздухе.'),
('сан', 'Звание, связанное с почётным положением.'),
('сани', 'Зимняя повозка на двух полозьях.'),
('сантолина', 'Кустарниковое растение семейства сложноцветных'),
('сантонин', 'Вещество, добываемое из цитварного семени, горьковатого вкуса, без запаха; употребляется, как противоглистное.'),
('сатин', 'Плотная глянцевитая хлопчатобумажная или шёлковая ткань.'),
('свет', 'Лучистая энергия, воспринимаемая глазом, делающая окружающий мир видимым.'),
('светоч', 'О том, кто несёт просвещение, истину, свободу.'),
('сев', ' Время посева.'),
('сен', 'Разменная монета Индонезии (= 1/100 рупии), Японии (= 1/100 иены), Кампучии (= 1/100 риеля), малайзии (= 1/100 малайзийского доллара).'),
('сено', 'Скошенная и высушенная трава для корма скота.'),
('сень', 'То, что покрывает, укрывает кого- (что-) нибудь, покров.'),
('сет', 'В большом теннисе: одна партия, в которой надо выиграть шесть её частей — геймов (с преимуществом в 2 гейма).'),
('сеть', 'Приспособление из закреплённых на равных промежутках перекрещивающихся нитей для ловли рыб, птиц.'),
('сиаль', 'Верхний слой земной оболочки, состоящий из пород, богатых кремнием и алюминием (в геологии).'),
('сила', '1) Способность живых существ напряжением мышц производить физические действия, движения; также вообще — физическая или моральная возможность активно действовать. 2) Энергия, воздействующая на материальные тела, а также степень интенсивности, напряжённости её.'),
('силан', 'Соединение кремния с водородом.'),
('силон', 'Род искусственного волокна.'),
('синь', '1. Синий цвет, синее пространство. 2. Синяя краска.'),
('сито', 'Приспособление для просеивания или процеживания чего-нибудь в виде мелкой сетки, натянутой на обруч, или металлического листа с мелкими отверстиями.'),
('слань', 'Настил из жердей или бревен в заболоченных, топких местах.'),
('слон', '1) Крупное млекопитающее с длинным хоботом и двумя бивнями. 2) Шахматная фигура, передвигающаяся на любое число клеток по диагонали.'),
('совет', 'Наставление, указание как поступить.'),
('соланин', 'Органическое ядовитое вещество.'),
('солано', 'Горячий и влажный восточный, юго-восточный или южный ветер на юго-востоке и юге Испании, а также в Риме. Возникает и усиливается при дневном солнечном прогреве. Действует на людей угнетающе, порождает неприятные ощущения страха из-за высокой температуры, влажности и запыленности.'),
('солитон', 'Структурно устойчивая уединённая волна, распространяющаяся в нелинейной среде (физический термин).'),
('соло', '1) Музыкальное произведение или его часть, предназначенные для одного инструмента или одного голоса. 2) Танец, исполняемый одним человеком.'),
('солонина', 'Мясо, пропитанное солью'),
('соль', 'Белое кристаллическое вещество с острым вкусом, употребляется как приправа к пище.'),
('сон', 'Состояние покоя и отдыха'),
('сонант', 'Слоговой или слогообразующий звук (противоположное: консонант) (в лингвистике).'),
('соната', 'Музыкальное произведение, состоящее из трёх или четырёх частей различного темпа и характера.'),
('сонатина', 'Небольшое музыкальное произведение для одного или нескольких инструментов.'),
('сонет', 'Стихотворение в 14 строк из двух четверостиший и двух трёхстиший.'),
('сонь', 'Сонное, сонливое состояние.'),
('сота', 'Часть восковых постройек пчел, предназначенная для хранения запасов корма (мёда и перги) и выращивания потомства.'),
('соте', 'Кушанье под соусом, приготовленное на сильном огне.'),
('соти', 'Комедийно-сатирический жанр французского театра XV-XVI вв. Возник на основе средневековых пародийно-шутовских представлений.'),
('сочень', 'Лепёшка, испечённая с загнутыми краями или в виде пирожка.'),
('сталь', 'Твёрдый серебристый металл, соединение железа с определённым количеством углерода.'),
('стан', 'Туловище человека.'),
('станина', 'Неподвижное основание машины, рама.'),
('станиоль', 'Тончайший лист олова или сплава его со свинцом, оловянная фольга.'),
('станица', 'Большое селение в казачьих областях.'),
('станнин', 'Минерал, оловянный колчедан.'),
('стен', 'Единица силы, равная силе, которая сообщает массе в одну тонну ускорение в один метр в секунду.'),
('стило', 'Небольшой цилиндрический инструмент из кости, металла или другого твердого материала, которым писали на восковых табличках.'),
('стиль', 'Характерный вид, разновидность чего-нибудь, выражающаяся в каких-нибудь особенных признаках, свойствах художественного оформления.'),
('стлань', '1) То, что постлано, покрывает слоем поверхность чего-либо 2) а) Дорога в виде настила из жердей, бревен и т.п. в заболоченных топких местах. б) Ряд бревен, положенных в виде мостика. 3) Деревянный настил в трюме судна.'),
('стол', 'Предмет мебели в виде широкой горизонтальной доски на высоких опорах, ножках.'),
('столица', 'Главный город государства.'),
('столон', 'Подземный или стелющийся по земле боковой побег растения, служащий для вегетативного размножения.'),
('стон', 'Протяжный звук, издаваемый от боли или при сильном горе.'),
('счет', '1) Результат чего-н. напр.игры, выраженный в числах. 2) Документ с указанием причитающихся денег за отпущенный товар, за выполненную работу и т.п.'),
('табак', 'Травянистое растение из семейства паслёновых, обычно с крупными листьями.'),
('табор', 'Группа семейств цыган, кочующих вместе.'),
('таи', 'Группа народов, расселенных в Южном Китае, странах Индокитая и Северо-Восточной Индии.'),
('талион', 'Принцип уголовной ответственности в раннеклассовом обществе, когда наказание точно соответствует причиненному вреду.'),
('талон', 'Общее название бумажных документов различного назначения, обычно небольшого формата.'),
('таль', 'Подвесное грузоподъёмное устройство'),
('тан', 'Исторический дворянский титул в Средние века в Шотландии: рыцарь, феодал, глава клана, шотландский лорд.'),
('танин', 'Порошок из коры растений, употребляется в медицине как вяжущее средство и в технике как дубильное вещество.'),
('тао', 'Вид наземных птиц семейства тинаму родом из Южной Америки. Признано четыре подвида.'),
('тар', '(муз.) Струнный щипковый (плекторный) музыкальный инструмент, традиционно распространённый в странах Средней Азии и Ближнего Востока.'),
('тара', 'Материал для упаковки (ящики, мешки, кули и т. п.).'),
('таро', 'Колода из 78 карт, состоящая из четырех мастей по 14 карт в каждой (в них на одну фигурную карту больше, чем в обычных колодах: это Кавалер, Рыцарь, или Всадник), и 22 символических иллюстрированных карт-козырей.'),
('тень', 'Участок поверхности или область пространства, менее ярко освещённые по сравнению с прочими, скрытые от прямых лучей света.'),
('тео', 'Традиционный вьетнамский театр.'),
('тес', 'Тонкие доски.'),
('течь', 'Проникновение жидкости (например, внутрь помещения или из него).'),
('тиас', 'В Древней Греции торжественное шествие в честь Диониса, участники которого были увенчаны плющом и держали в руках тирсы. Также религиозное общество для совместных жертвоприношений богам, культ которых сопровождался оргиями.'),
('тина', 'Водоросли, плавающие густой массой в стоячей или малопроточной воде и при оседании образующие вместе с илом вязкое дно.'),
('тиноль', 'Смесь оловянного порошка с паяльным жиром, используемая для паяния.'),
('тиол', 'Продукт, получаемый искусственно и заменяющий в врачебной практике ихтиол, стоящий гораздо дороже.'),
('тис', 'Род вечнозеленых хвойных деревьев и кустарников семейства тисовых, которые славятся темной, очень густой листвой, позволяющей путем стрижки создавать живые изгороди и фигурные кроны самой различной формы.'),
('ток', 'Движение электрического заряда в проводнике.'),
('тол', 'Взрывчатое вещество, применяемое в военном деле и технике.'),
('толос', 'Монументальное, круглое в плане здание гробница, храм — в эгейской культуре и античном мире.'),
('толь', 'Пропитанный водонепроницаемым составом толстый и твёрдый картон, употр. как кровельный материал.'),
('тон', 'Звук определённой высоты, музыкальный звук в отличие от шума.'),
('тонина', 'Величина поперечного сечения отдельного волокна шерсти, хлопка.'),
('тонна', 'Мера веса в метрической системе, равная 1000 кг.'),
('тор', '(матем.) Геометрическая фигура, имеющая форму баранки или спасательного круга, получаемая вращением круга около оси, лежащей в его плоскости.'),
('тора', 'У евреев-иудаистов: первая часть Библии, так наз. «Пятикнижие Моисеево»; свиток с текстом пятикнижия, хранимый в синагоге как предмет религиозного культа.'),
('торба', 'Мешок, сума.'),
('тоса', 'Школа японской живописи середины XV - середины XIX вв. Отличалась яркостью колорита, каллиграфической изысканностью рисунков тушью.'),
('трак', 'Звено гусеничной ленты.'),
('трок', 'Широкий ремень, тесьма для укрепления седла, попоны на лошади как принадлежность конской упряжи; подпруга.'),
('цата', 'Элемент в форме перевернутого полумесяца, иногда с фигурно вырезанным краем, расположенный в нижней части православного креста.'),
('циан', 'Бесцветный газ с резким запахом.'),
('цианат', 'Соль циановой кислоты.'),
('циста', 'Временная форма существования микроорганизмов (обычно бактерий и протистов, многих одноклеточных), характеризующаяся наличием защитной оболочки, которая образуется в неблагоприятных условиях или в определенные моменты их жизненного цикла, а также сама эта оболочка.'),
('чес', '1) То же, что и чесание. 2) Зуд, чесотка.'),
('честь', 'Общественно-моральное достоинство, то, что вызывает и поддерживает общее уважение, чувство гордости.'),
('чет', 'Чётное число.'),
('чон', 'Разменная монета Корейской Народно-Демократической Республики и  Южной Кореи.');

-- 
-- Вывод данных для таблицы games
--
INSERT INTO games VALUES
(1, 'Слова из слова', 'Необходимо составлять слова из показанного на экране слова. Слово должно быть нарицательным именем существительным в единственном числе. Уменьшительно-ласкательные формы, а также сокращения не принимаются. Минимальная длина слова - 3 буквы.\r\n\r\n     \r\n', '/games/wordsFromWord/', 'Stanislav', 'production'),
(2, 'Балда', 'Играют двое (в данном случае Вы и моя программа). В середине поля, состоящего из 25 клеток, выбирается слово из пяти букв.\r\nВаш ход первый - Вы должны придумать новое слово, состоящее из уже находящихся на поле букв и обязательно одной новой буквы, которую вы добавляете.\r\nЧем длиннее слово вы придумаете, тем больше очков Вы получаете.\r\nОдна буква - одно очко.\r\nПотом, с добавлением новой буквы, ходит соперник и так далее по очереди.\r\nСлова в одной игре повторяться не могут.\r\nИгра завершается при заполнении последней клетки поля. Выигрывает тот, у кого больше очков.\r\nСлово может образовываться из букв, находящихся последовательно в любом направлении от клетки к клетке вверх, вниз, влево или вправо, но не по диагонали и без пересечений. ', '/games/balda', 'WebPartner', 'development'),
(3, 'Угадайка', 'Правила Угадайки', 'путь к угадайке', 'автор угадайки', 'production'),
(4, 'неугадйка', 'Правила неУгадайки', 'путь к неугадайке', 'автор неугадайки', 'development');

-- 
-- Вывод данных для таблицы players
--
INSERT INTO players VALUES
(45, 'Alex', '$2y$10$3Iiq08gyIeZj.3DMmF2gpuuqMBTf2WU3FOkXA4Ax71jgtav//zrfC', '4343@tut.by', 'user', '/files/images/players/45.jpg', 243, 3),
(46, 'Andrew', '$2y$10$L8.he8TtQdaKOhzLN8NqROM8XseUfFTZS1egHo5YwWQUH1mB7KGPO', 'andrew.sd@homan.ru', 'user', '/files/images/players/no_avatar.png', 0, 1),
(47, 'Andreww', '$2y$10$XrX27qnLRan8ESqDdLYzFuMusVvsCe9J.rAFiDrwAY7PX2x06cNm.', '', 'user', '/files/images/players/no_avatar.png', 0, 1),
(48, 'Petr', '$2y$10$49ifHT6U2ixqnrt829b/w.vBtihAQsU1dyh8ouvXCg1/olouDHy/C', 'petr@mmmm.gmail.com', 'user', '/files/images/players/no_avatar.png', 0, 1),
(49, 'Lexa', '$2y$10$qncQIk/h0/214FwPMcNY.OThxkiOxre8IIQLUGWWzVwpTJ9NmVHTu', '', 'user', '/files/images/players/no_avatar.png', 0, 1),
(60, 'Scss', '$2y$10$3bK0tcUqPh9ZaRkDP6Sd/eXMNr0F5caauHWZ/oqMsPIOR26FX1LTi', 'ghivan.iv@gmail.com', 'user', '/files/images/players/60.JPG', 0, 1),
(61, 'Andrew2', '$2y$10$1g3zgCf0cNjvIy8QwVpYnO1QLvFyxn2s.KogX067x7XrxDgmSgIFS', '', 'user', '/files/images/players/no_avatar.png', 0, 1),
(62, '234234234', '$2y$10$7OMRFuymnaW98B1uEHkozOqgr8qLyoOvlxkZfBfbEY7s0CoB1J5aO', '', 'user', '/files/images/players/no_avatar.png', 0, 1),
(63, '123123123', '$2y$10$Or31fwmAChpIcFvMnsyO9uWf5aJWw/J12gY.MGJKmHUTUE85V/D2e', '2342342@fghfghfghfgh.fghfgh', 'user', '/files/images/players/no_avatar.png', 0, 1),
(64, 'Phill', '$2y$10$AalpxlkBAf8qccPbl6CpNeEqFWPLxfJZb5UUYw.xHv4bsT5eoFXJi', 'ghyturv.jk@gmail.com', 'user', '/files/images/players/no_avatar.png', 0, 1),
(65, 'Hacked', '$2y$10$HKQFCBU8Xp2NB5VO2CdRr.ppT3E085ZH4YJ.34OkoMyD0DoSO6jcq', 'tanya-evstifeeva.evstifeeva@yandex.ru', 'user', '/files/images/players/65.jpg', 0, 1);

-- 
-- Вывод данных для таблицы wfw_levels
--
INSERT INTO wfw_levels VALUES
(1, 'родина', 'аир,дан,дао,дар,дно,дон,идо,иод,ион,ноа,ода,рад,род,анид,анод,дари,дина,дорн,дрон,ирод,нард,нора,норд,орда,рани,адрон,данио,динар,надир,народ,радио,радон', 'p:3'),
(2, 'вечность', 'вес,нос,ост,ось,сев,сен,сет,сон,тео,тес,тон,чес,чет,чон,вено,вест,весь,вето,вонь,енот,новь,ночь,овен,овес,ость,очес,свет,сено,сень,сеть,сонь,соте,стен,стон,счет,тень,течь,весть,осень,отвес,отсев,совет,сонет,честь,светоч,сочень', 'в:4'),
(3, 'акробат', 'аак,акр,акт,ара,бак,бар,бат,боа,бок,бор,бот,бра,кат,коб,кор,кот,орт,раб,рак,рок,рот,тао,тар,ток,тор,абак,акат,араб,арак,арат,арба,арка,бакт,бара,барк,бора,борт,брак,брат,кара,карт,ката,кора,корт,краб,крот,окат,окра,роба,рота,тара,таро,тора,трак,трок,аборт,актор,аорта,бакор,барак,барка,карат,карта,катар,кобра,обкат,обрат,отара,ракат,табак,табор,торба,бакота,батрак,брокат,работа', 'а:5');

-- 
-- Вывод данных для таблицы wfw_levelsPassed
--

-- Таблица wordsgames.wfw_levelsPassed не содержит данных

-- 
-- Вывод данных для таблицы wfw_scoreTable
--

-- Таблица wordsgames.wfw_scoreTable не содержит данных

DELIMITER $$

--
-- Описание для триггера lvlCount
--
CREATE TRIGGER lvlCount
	BEFORE UPDATE
	ON players
	FOR EACH ROW
BEGIN
IF (NEW.exp <> OLD.exp AND NEW.exp > 0) THEN
IF NEW.exp >= countExp(NEW.`level`) THEN
WHILE NEW.exp >= countExp(NEW.`level`)
  DO
    set NEW.level = NEW.level + 1;
  END WHILE;
ELSEIF  NEW.exp < countExp(NEW.`level` - 1) THEN
  WHILE NEW.exp < countExp(NEW.`level` - 1)
  DO
    set NEW.level = NEW.level - 1;
  END WHILE;
END IF;
END IF;
END
$$

DELIMITER ;

-- 
-- Восстановить предыдущий режим SQL (SQL mode)
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Включение внешних ключей
-- 
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;