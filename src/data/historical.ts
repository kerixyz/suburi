import { SuburiEntry, normalizeName } from '@/types';

// Raw historical data from spreadsheet
const SEED_DATA = `4/7/2025	angge	100
4/7/2025	ejay	100
4/8/2025	angge	110
4/8/2025	Verns	150
4/8/2025	Skye	150
4/8/2025	Shane	100
4/8/2025	Angelo Ampil	200
4/8/2025	Noel	150
4/8/2025	Masamichi Itoh	200
4/8/2025	Chihiro	200
4/8/2025	Ezekiel Santos	120
4/8/2025	Ryan G	500
4/8/2025	Prince	150
4/8/2025	ejay	100
4/8/2025	Juen Beatingo	1100
4/9/2025	Elvie	200
4/9/2025	Nicanor Padilla IV	400
4/9/2025	Quincy	200
4/9/2025	Verns Chiongbian	200
4/9/2025	Shane Chiongbian	200
4/9/2025	Janelle	300
4/9/2025	neo	200
4/9/2025	Johnny L.	400
4/9/2025	Kyrios Zipagan	100
4/9/2025	angge	200
4/9/2025	Japhet Mamaoag	220
4/9/2025	Angelo Ampil	480
4/9/2025	Noel	320
4/9/2025	Chichay Sison	200
4/9/2025	Chenney Navarro	340
4/9/2025	Juen Beatingo	1100
4/9/2025	Ten (IKC)	200
4/9/2025	Robert	500
4/9/2025	Suji	300
4/9/2025	Ginn	300
4/9/2025	ejay	100
4/9/2025	Kutch	320
4/9/2025	Prince	200
4/9/2025	Erica	100
4/9/2025	Masamichi Itoh	350
4/9/2025	Chihiro	350
4/9/2025	Jomar	200
4/9/2025	Ice	200
4/9/2025	Tomoyuki Akita	350
4/9/2025	Eden	200
4/10/2025	Kyrios Zipagan	200
4/10/2025	Elvie Inoue	500
4/10/2025	Jan (張蔡建)	150
4/10/2025	MJ Ng Cha	340
4/10/2025	Verns Chiongbian	200
4/10/2025	Angelo Ampil	200
4/10/2025	Chihiro	200
4/10/2025	Nicanor Padilla IV	200
4/10/2025	Janelle	300
4/10/2025	angge	200
4/10/2025	Chenney Navarro	120
4/10/2025	Jomar	100
4/10/2025	Ice	100
4/10/2025	Tomoyuki Akita	200
4/10/2025	Japhet Mamaoag	200
4/10/2025	Juen Beatingo	1100
4/10/2025	Chichay Sison	200
4/10/2025	Noel	210
4/10/2025	ejay	100
4/10/2025	Prince	210
4/10/2025	Erica	100
4/10/2025	Masamichi Itoh	250
4/10/2025	Eden	100
4/11/2025	Elvie	320
4/11/2025	Angelo Ampil	200
4/11/2025	Verns Chiongbian	200
4/11/2025	Chihiro	300
4/11/2025	Juancho Macalla	200
4/11/2025	Dwayne Morales	300
4/11/2025	Jan (張蔡建)	80
4/11/2025	Viridian Gym (Denise+Zach)	1000
4/11/2025	Masamichi Itoh	350
4/11/2025	angge	200
4/11/2025	Chichay Sison	200
4/11/2025	Robert	500
4/11/2025	Suji	500
4/11/2025	MJ (yushinkai)	500
4/11/2025	Davao Yushinkai	1500
4/11/2025	Juen Beatingo	1100
4/11/2025	ejay	100
4/11/2025	Kutch	210
4/11/2025	Noel	210
4/11/2025	Erica	100
4/11/2025	Eden	200
4/12/2025	Juancho Macalla	500
4/12/2025	Elvie	500
4/12/2025	Fids	150
4/12/2025	MJ Ng Cha	410
4/12/2025	angge	230
4/12/2025	Iloilo Kendo Club	3600
4/12/2025	Angus Young (Darwin Kendo Club)	250
4/12/2025	Davao Yushinkai	1200
4/12/2025	Juen Beatingo	1100
4/12/2025	ejay	200
4/12/2025	Angelo Ampil	180
4/12/2025	Viridian Gym	750
4/12/2025	Masamichi Itoh	150
4/12/2025	Chihiro	150
4/12/2025	Davao Kendo Club	5200
4/12/2025	Jan (張蔡建)	120
4/12/2025	Erica	100
4/12/2025	Prince	200
4/12/2025	Davao Kenyukai	1440
4/12/2025	Eden	200
4/12/2025	Kutch	140
4/12/2025	Noel	780
4/12/2025	ethan	40
4/13/2025	Elvie	350
4/13/2025	Lyle Castroverde	180
4/13/2025	MJ Ng Cha	410
4/13/2025	Masamichi Itoh	350
4/13/2025	Dwayne Morales	710
4/13/2025	Jan (張蔡建)	60
4/13/2025	Robert	400
4/13/2025	angge	200
4/13/2025	ejay	200
4/13/2025	Erica	200
4/13/2025	Viridian Gym (D+Z)	840
4/13/2025	Kendo Community (Davao)	4000
4/13/2025	Raffy	290
4/13/2025	Kutch	270
4/13/2025	Noel	780
4/13/2025	ethan	260
4/14/2025	MJ Ng Cha	410
4/14/2025	Davao Yushinkai	2500
4/14/2025	Angelo Ampil	200
4/14/2025	Raffy	200
4/14/2025	Dwayne Morales	300
4/14/2025	angge	220
4/14/2025	Elvie	300
4/14/2025	Eden	100
4/14/2025	Verns	200
4/14/2025	Gek	200
4/14/2025	Rafa	200
4/14/2025	Juancho Macalla	600
4/14/2025	ejay	200
4/14/2025	Juen Beatingo	1200
4/14/2025	Erica	200
4/14/2025	Viridian Gym (D+Z)	900
4/14/2025	ethan	410
4/15/2025	Arlene	500
4/15/2025	Elvie	540
4/15/2025	MJ Ng Cha	410
4/15/2025	Raffy	100
4/15/2025	janelle	300
4/15/2025	angge	200
4/15/2025	Eden	200
4/15/2025	Prince	100
4/15/2025	Erica	200
4/15/2025	Viridian Gym (D+Z)	720
4/15/2025	ejay	200
4/15/2025	Robert	500
4/16/2025	Chichay Sison	250
4/16/2025	Elvie	410
4/16/2025	Angelo Ampil	200
4/16/2025	MJ Ng Cha	410
4/16/2025	Raffy	250
4/16/2025	Margate Sky (DKC)	5490
4/16/2025	Juancho Macalla	200
4/16/2025	angge	200
4/16/2025	Chichay Sison	300
4/16/2025	Dwayne Morales	400
4/16/2025	Eden	200
4/16/2025	ejay	200
4/16/2025	Jozef	1000
4/16/2025	Prince	350
4/16/2025	Erica	200
4/16/2025	Davao Yushinkai	3000
4/16/2025	Noel	80
4/16/2025	Viridian Gym (Z+his kouhai-tachi)	1800
4/16/2025	Davao Kendo Club	2000
4/17/2025	Jozef	1000
4/17/2025	Elvie	500
4/17/2025	Raffy	250
4/17/2025	Eden	200
4/17/2025	Angelo Ampil	200
4/17/2025	angge	200
4/17/2025	Robert	500
4/17/2025	ejay	200
4/17/2025	Juen Beatingo	1100
4/17/2025	Viridian Gym (Z)	450
4/18/2025	Jozef	575
4/18/2025	Elvie	220
4/18/2025	MJ Ng Cha	410
4/18/2025	Robert	1400
4/18/2025	Noel	100
4/18/2025	Juen Beatingo	1100
4/18/2025	ejay	200
4/18/2025	angge	200
4/18/2025	Juancho Macalla	200
4/18/2025	Raffy	50
4/18/2025	Erica	200
4/19/2025	Arlene	500
4/19/2025	MJ Ng Cha	410
4/19/2025	Elvie	150
4/19/2025	ejay	200
4/19/2025	angge	200
4/19/2025	Raffy	150
4/19/2025	Davao Yushinkai	2040
4/19/2025	Viridian Gym (Z)	300
4/19/2025	Erica	200
4/20/2025	MJ Ng Cha	410
4/20/2025	Elvie	300
4/20/2025	Raffy	270
4/20/2025	Robert	460
4/20/2025	Viridian Gym (Z)	250
4/20/2025	Juen Beatingo	1500
4/20/2025	angge	200
4/20/2025	Erica	200
4/21/2025	MJ Ng Cha	410
4/21/2025	Elvie	300
4/21/2025	Raffy	50
4/21/2025	Juancho Macalla	200
4/21/2025	ejay	300
4/21/2025	Juen Beatingo	1100
4/21/2025	angge	200
4/21/2025	Erica	200
4/21/2025	Chenney Navarro	50
4/22/2025	Jozef	1000
4/22/2025	Elvie	320
4/22/2025	MJ Ng Cha	410
4/22/2025	Nicanor Padilla IV	200
4/22/2025	Raffy	100
4/22/2025	Kyrios "Cutie"	175
4/22/2025	angge	200
4/22/2025	Allan Z	500
4/22/2025	Juancho Macalla	200
4/22/2025	ejay	300
4/22/2025	Erica	200
4/22/2025	Prince	150
4/22/2025	Robert	300
4/22/2025	Chenney Navarro	100
4/23/2025	Jozef	670
4/23/2025	Raffy	200
4/23/2025	MJ Ng Cha	410
4/23/2025	Ten (Iloilo Kendo Club)	1000
4/23/2025	Allan Z	500
4/23/2025	Davao Yushinkai	1800
4/23/2025	ejay	200
4/23/2025	Verns	200
4/23/2025	Margate Sky (DKC)	1500
4/23/2025	Juen Beatingo	1100
4/23/2025	Grace (IKC)	500
4/23/2025	Elvie	170
4/23/2025	Chenney Navarro	310
4/23/2025	angge	200
4/23/2025	Erica	200
4/24/2025	Elvie	320
4/24/2025	MJ Ng Cha	410
4/24/2025	Nicanor Padilla IV	200
4/24/2025	Chichay Sison	400
4/24/2025	Allan Z	500
4/24/2025	Raffy	150
4/24/2025	ejay	200
4/24/2025	angge	200
4/24/2025	Chenney Navarro	200
4/24/2025	Erica	200
4/25/2025	Raffy	250
4/25/2025	Elvie	220
4/25/2025	Chichay Sison	200
4/25/2025	Kyrios Zipagan	300
4/25/2025	Juen Beatingo	1100
4/25/2025	ejay	200
4/25/2025	ethan	200
4/25/2025	Davao Yushinkai	1800
4/25/2025	Ateneo Ken(AJKC)	1200
4/25/2025	angge	200
4/25/2025	Chenney Navarro	230
4/25/2025	Verns	200
4/25/2025	Erica	200
4/26/2025	Jozef	160
4/26/2025	MJ Ng Cha	410
4/26/2025	Lyle Castroverde	120
4/26/2025	Jan (張蔡建)	60
4/26/2025	angge	200
4/26/2025	Chenney Navarro	230
4/26/2025	Verns	200
4/26/2025	Erica	200
4/26/2025	Prince	250
4/26/2025	Davao Kendo Club	1500
4/27/2025	Sorel Karl (DKC)	1000
4/27/2025	MJ Ng Cha	410
4/27/2025	Raffy	310
4/27/2025	Chenney Navarro	120
4/27/2025	angge	200
4/27/2025	Verns	200
4/27/2025	Kyrios Zipagan	200
4/27/2025	Erica	200
4/27/2025	Prince	200
4/28/2025	Elvie	380
4/28/2025	Raffy	350
4/28/2025	MJ Ng Cha	410
4/28/2025	Ezekiel Santos	200
4/28/2025	Jan (張蔡建)	90
4/28/2025	Ethan	1000
4/28/2025	Arlene	500
4/28/2025	Chichay Sison	300
4/28/2025	ejay	300
4/28/2025	angge	200
4/28/2025	Davao Yushinkai	1800
4/28/2025	noel	780
4/28/2025	Erica	200
4/29/2025	elvie	200
4/29/2025	MJ Ng Cha	410
4/29/2025	Quincy	100
4/29/2025	Jan (張蔡建)	80
4/29/2025	Chichay Sison	300
4/29/2025	Raffy	100
4/29/2025	Juen Beatingo	1300
4/29/2025	angge	200
4/29/2025	Robert	200
4/29/2025	Verns	200
4/29/2025	ejay	300
4/29/2025	Erica	200
4/30/2025	Nicanor Padilla IV	200
4/30/2025	Raffy	300
4/30/2025	Ateneo Ken(AJKC)	7900
4/30/2025	Juen Beatingo	1100
4/30/2025	angge	100
4/30/2025	Verns	400
4/30/2025	ejay	300
4/30/2025	Erica	200
5/1/2025	Raffy	200
5/1/2025	elvie	210
5/1/2025	MJ Ng Cha	410
5/1/2025	Verns	200
5/1/2025	Juen Beatingo	1100
5/1/2025	Angelo Tablante Ampil	300
5/1/2025	ejay	300
5/1/2025	angge	200
5/1/2025	noel	200
5/1/2025	Erica	200
5/2/2025	Jozef	500
5/2/2025	Raffy	450
5/2/2025	MJ Ng Cha	410
5/2/2025	Angelo Tablante Ampil	200
5/2/2025	Juancho + Prince	100
5/2/2025	Erica	200
5/3/2025	elvie	200
5/3/2025	Verns	200
5/3/2025	ejay	300
5/3/2025	Davao Yushinkai	2700
5/3/2025	Jan (張蔡建)	50
5/3/2025	Erica	200
5/4/2025	Raffy	230
5/4/2025	Verns	400
5/4/2025	angge	200
5/4/2025	ejay	100
5/4/2025	Erica	200
5/5/2025	Ten (IKC)	600
5/5/2025	Raffy	300
5/5/2025	Allan Z	500
5/5/2025	Chichay Sison	300
5/5/2025	ejay	200
5/5/2025	Davao Yushinkai	1800
5/5/2025	Eden	100
5/5/2025	Erica	200
5/6/2025	Raffy	400
5/6/2025	elvie	100
5/6/2025	noel	200
5/6/2025	angge	200
5/6/2025	Juen Beatingo	1100
5/6/2025	Robert	300
5/6/2025	ejay	200
5/6/2025	Erica	200
5/7/2025	Chichay Sison	300
5/7/2025	angge	100
5/7/2025	ejay	200
5/7/2025	elvie	210
5/7/2025	Eden	200
5/7/2025	Erica	200
5/8/2025	elvie	350
5/8/2025	Eden	300
5/8/2025	Jan (張蔡建)	200
5/8/2025	Chichay Sison	300
5/8/2025	ejay	200
5/8/2025	Raffy	210
5/8/2025	Erica	200
5/9/2025	Eden	300
5/9/2025	Judith O	300
5/9/2025	Erica	200
5/9/2025	Raffy	50
5/9/2025	ejay	200
5/9/2025	angge	150
5/9/2025	Davao Yushinkai	1800
5/10/2025	Lyle Castroverde	120
5/10/2025	ejay	200
5/10/2025	Jan (張蔡建)	70
5/10/2025	Elvie	120
5/10/2025	Raffy	200
5/10/2025	angge	200
5/10/2025	Quincy	100
5/10/2025	Davao Yushinkai	3300
5/10/2025	Erica	200
5/11/2025	Elvie	100
5/11/2025	Raffy	300
5/11/2025	Robert	300
5/11/2025	ejay	200
5/11/2025	angge	200
5/11/2025	Erica	200
5/12/2025	Raffy	50
5/12/2025	angge	200
5/12/2025	ejay	200
5/12/2025	Erica	200
5/13/2025	Nicanor Padilla IV	200
5/13/2025	Chichay Sison	350
5/13/2025	ejay	200
5/13/2025	Raffy	50
5/13/2025	angge	200
5/13/2025	Erica	200
5/13/2025	Eden	300
5/14/2025	Raffy	200
5/14/2025	angge	200
5/14/2025	ejay	200
5/14/2025	elvie	260
5/14/2025	Erica	200
5/14/2025	Eden	200
5/15/2025	Dwayne Morales	410
5/15/2025	MJ Ng Cha	410
5/15/2025	Nicanor Padilla IV	200
5/15/2025	Raffy	250
5/15/2025	ejay	300
5/15/2025	angge	200
5/15/2025	Erica	200
5/16/2025	ejay	200
5/16/2025	elvie	100
5/16/2025	Raffy	50
5/16/2025	Angelo	300
5/16/2025	MJ Ng Cha	410
5/16/2025	angge	200
5/16/2025	Eden	300
5/16/2025	Erica	200
5/17/2025	ejay	300
5/17/2025	Nicanor Padilla IV	250
5/17/2025	MJ Ng Cha	410
5/17/2025	Angelo	200
5/17/2025	Raffy	50
5/17/2025	Jan (張蔡建)	60
5/17/2025	Erica	200
5/18/2025	Angelo	200
5/18/2025	Raffy	230
5/18/2025	ejay	200
5/18/2025	Erica	200
5/19/2025	MJ Ng Cha	410
5/19/2025	Raffy	250
5/19/2025	Jan (張蔡建)	200
5/19/2025	ejay	200
5/19/2025	elvie	300
5/19/2025	angge	200
5/19/2025	Erica	200
5/20/2025	elvie	100
5/20/2025	Raffy	100
5/20/2025	Jan (張蔡建)	200
5/20/2025	Erica	200
5/21/2025	Chichay Sison	400
5/21/2025	elvie	330
5/21/2025	angge	200
5/21/2025	ejay	300
5/21/2025	MJ Ng Cha	410
5/21/2025	Erica	200
5/21/2025	angge	20
5/22/2025	Nicanor Padilla IV	200
5/22/2025	elvie	200
5/22/2025	Chichay Sison	400
5/22/2025	Judith O	300
5/22/2025	MJ Ng Cha	410
5/22/2025	Raffy	200
5/22/2025	ejay	200
5/22/2025	Erica	200
5/22/2025	angge	150
5/23/2025	Raffy	100
5/23/2025	MJ Ng Cha	410
5/23/2025	Erica	200
5/24/2025	ejay	300
5/24/2025	Raffy	200
5/24/2025	Erica	200
5/25/2025	MJ Ng Cha	410
5/25/2025	ejay	400
5/25/2025	Raffy	200
5/25/2025	Erica	200
5/25/2025	angge	50
5/26/2025	MJ Ng Cha	410
5/26/2025	Chichay Sison	400
5/26/2025	ejay	300
5/26/2025	Erica	200
5/26/2025	angge	50
5/27/2025	elvie	200
5/27/2025	Lyle Castroverde	100
5/27/2025	Chichay Sison	400
5/27/2025	Viridian Gym	400
5/27/2025	Erica	200
5/28/2025	elvie	320
5/28/2025	ejay	200
5/28/2025	Erica	200
5/28/2025	Prince	200
5/29/2025	elvie	200
5/29/2025	MJ Ng Cha	410
5/29/2025	ejay	200
5/29/2025	Viridian Gym	510
5/29/2025	Erica	200
5/29/2025	Prince	200
5/29/2025	Raffy	200
5/29/2025	angge	200
5/30/2025	MJ Ng Cha	250
5/30/2025	Erica	100
5/30/2025	Viridian Gym	620
5/30/2025	Raffy	50
5/31/2025	Raffy	250
5/31/2025	elvie	250
5/31/2025	Viridian Gym	300
5/31/2025	ejay	200
6/1/2025	Raffy	230
6/1/2025	Eden	500
6/1/2025	ejay	200
6/2/2025	Raffy	300
6/2/2025	Eden	200
6/2/2025	elvie	110
6/2/2025	ejay	200
6/3/2025	Jozef	1000
6/3/2025	Eden	300
6/3/2025	angge	200
6/4/2025	Raffy	300
6/4/2025	Chichay Sison	150
6/4/2025	ejay	300
6/4/2025	jozef	620
6/5/2025	jozef	500
6/5/2025	elvie	150
6/5/2025	Raffy	200
6/5/2025	ejay	100
6/5/2025	angge	200
6/6/2025	ejay	300
6/6/2025	angge	100
6/7/2025	elvie	200
6/8/2025	ejay	300
6/9/2025	Chichay Sison	400
6/9/2025	angge	200
6/10/2025	angge	100
6/11/2025	elvie	520
6/11/2025	Juancho Macalla	1110
6/12/2025	Lyle Castroverde	100
6/13/2025	Juancho Macalla	220
6/13/2025	Juancho Macalla	200
6/14/2025	elvie	220
6/15/2025	Juancho Macalla	50
6/16/2025	Nicanor Padilla IV	200
6/16/2025	Juancho Macalla	250
6/17/2025	Lyle Castroverde	110
6/17/2025	Juancho Macalla	200
6/17/2025	Raffy	50
6/17/2025	Chichay Sison	200
6/17/2025	elvie	100
6/18/2025	Raffy	350
6/18/2025	elvie	330
6/19/2025	elvie	200
6/20/2025	Raffy	200
6/21/2025	Juancho Macalla	100
6/21/2025	elvie	230
6/21/2025	Raffy	200
6/22/2025	Juancho Macalla	100
6/22/2025	elvie	200
6/22/2025	Raffy	200
6/15/2025	elvie	200
6/24/2025	MJ Ng Cha	410
6/24/2025	Raffy	200
6/24/2025	elvie	150
6/25/2025	MJ Ng Cha	410
6/25/2025	Raffy	350
6/25/2025	Juancho Gabriel Macalla	200
6/25/2025	elvie	290
6/25/2025	Chichay Sison	300
6/26/2025	Raffy	500
6/25/2025	angge	200
6/27/2025	angge	200
6/27/2025	elvie	150
6/28/2025	elvie	250
6/29/2025	elvie	100
6/30/2025	Lyle Castroverde	180
6/29/2025	Raffy	310
7/2/2025	Raffy	350
7/2/2025	Juancho Gabriel Macalla	210
7/2/2025	angge	200
6/13/2025	ejay	200
7/2/2025	ejay	150
7/2/2025	elvie	270
7/2/2025	MJ Ng Cha	410
7/3/2025	Raffy	100
7/3/2025	angge	200
7/4/2025	Raffy	100
7/4/2025	MJ Ng Cha	450
7/5/2025	ejay	250
7/5/2025	Raffy	350
7/8/2025	elvie	230
7/8/2025	Nicanor Padilla IV	200
7/8/2025	Chichay Sison	210
7/8/2025	Lyle Castroverde	200
7/6/2025	ejay	200
7/8/2025	ejay	350
7/9/2025	ejay	150
7/9/2025	elvie	260
7/10/2025	elvie	200
7/9/2025	MJ Ng Cha	450
7/10/2025	Chichay Sison	200
7/11/2025	MJ Ng Cha	450
7/11/2025	elvie	100
7/12/2025	elvie	180
7/10/2025	ejay	200
7/11/2025	ejay	200
7/12/2025	ejay	150
7/13/2025	ejay	250
7/13/2025	Raffy	230
7/14/2025	Raffy	100
7/14/2025	elvie	200
7/14/2025	ejay	250
7/15/2025	elvie	150
7/15/2025	MJ Ng Cha	450
7/14/2025	Raffy	200
7/16/2025	ejay	200
7/16/2025	elvie	240
7/17/2025	elvie	100
7/17/2025	MJ Ng Cha	450
7/17/2025	Quincy	300
7/19/2025	elvie	150
7/19/2025	Lyle Castroverde	150
7/20/2025	Lyle Castroverde	100
7/20/2025	elvie	150
6/30/2025	Erica	100
7/1/2025	Erica	100
7/2/2025	Erica	100
7/3/2025	Erica	100
7/4/2025	Erica	100
7/5/2025	Erica	100
7/6/2025	Erica	100
7/7/2025	Erica	100
7/8/2025	Erica	100
7/9/2025	Erica	100
7/10/2025	Erica	100
7/11/2025	Erica	100
7/12/2025	Erica	100
7/13/2025	Erica	100
7/14/2025	Erica	100
7/15/2025	Erica	100
7/16/2025	Erica	100
7/17/2025	Erica	100
7/18/2025	Erica	100
7/19/2025	Erica	100
7/20/2025	Erica	100
7/18/2025	Verns	1000
7/21/2025	Lyle Castroverde	100
7/22/2025	Lyle Castroverde	100
7/4/2025	angge	200
7/5/2025	angge	200
7/6/2025	angge	200
7/8/2025	angge	200
7/9/2025	angge	200
7/10/2025	angge	200
7/11/2025	angge	200
7/12/2025	angge	200
7/13/2025	angge	200
7/14/2025	angge	200
7/15/2025	angge	200
7/16/2025	angge	200
7/17/2025	angge	200
7/18/2025	angge	200
7/19/2025	angge	200
7/20/2025	angge	200
7/21/2025	angge	200
7/22/2025	angge	200
7/22/2025	MJ Ng Cha	450
7/22/2025	Chichay Sison	200
7/17/2025	ejay	200
7/18/2025	ejay	200
7/19/2025	ejay	200
7/20/2025	ejay	200
7/22/2025	ejay	200
7/23/2025	elvie	200
7/24/2025	Raffy	300
7/23/2025	ejay	300
7/24/2025	ejay	300
7/26/2025	Raffy	100
7/27/2025	Raffy	100
7/25/2025	ejay	200
7/26/2025	ejay	200
7/28/2025	ejay	200
7/29/2025	ejay	200
7/30/2025	Raffy	100
7/30/2025	ejay	200
7/31/2025	Raffy	200
7/31/2025	Chichay Sison	200
7/31/2025	ejay	200
7/21/2025	Erica	100
7/22/2025	Erica	100
7/23/2025	Erica	100
7/24/2025	Erica	100
7/25/2025	Erica	100
7/26/2025	Erica	100
7/27/2025	Erica	100
7/28/2025	Erica	100
7/29/2025	Erica	100
7/30/2025	Erica	100
7/31/2025	Erica	100
8/1/2025	Erica	100
8/2/2025	Erica	100
8/2/2025	ejay	200
8/3/2025	ejay	200
8/3/2025	Raffy	200
8/4/2025	Raffy	50
8/2/2025	Verns	100
8/3/2025	Verns	100
8/4/2025	Verns	100
8/4/2025	ejay	200
8/5/2025	Chichay Sison	200
8/5/2025	Raffy	100
8/7/2025	Chichay Sison	200
8/10/2025	Raffy	100
8/6/2025	ejay	200
8/7/2025	ejay	200
8/8/2025	ejay	200
8/9/2025	ejay	100
8/10/2025	ejay	100
8/13/2025	ejay	300
8/14/2025	ejay	200
8/15/2025	Hendritz	150
8/15/2025	ejay	200
8/16/2025	ejay	300
8/17/2025	Hendritz	150
8/18/2025	ejay	150
8/19/2025	ejay	150
8/20/2025	Raffy	150
8/20/2025	ejay	150
8/21/2025	Raffy	200
8/22/2025	Raffy	200
8/22/2025	Nicanor Padulla IV	200
8/3/2025	Erica	100
8/4/2025	Erica	100
8/5/2025	Erica	100
8/6/2025	Erica	100
8/7/2025	Erica	100
8/8/2025	Erica	100
8/9/2025	Erica	100
8/10/2025	Erica	100
8/11/2025	Erica	100
8/12/2025	Erica	100
8/13/2025	Erica	100
8/14/2025	Erica	100
8/15/2025	Erica	100
8/16/2025	Erica	100
8/17/2025	Erica	100
8/18/2025	Erica	100
8/19/2025	Erica	100
8/20/2025	Erica	100
8/21/2025	Erica	100
8/22/2025	Erica	100
8/23/2025	Erica	100
8/21/2025	ejay	150
8/23/2025	ejay	250
8/24/2025	ejay	250
8/25/2025	ejay	200
8/26/2025	ejay	100
8/27/2025	ejay	150
8/28/2025	ejay	200
7/23/2025	angge	200
7/25/2025	angge	200
7/26/2025	angge	200
7/29/2025	angge	200
8/4/2025	angge	200
8/5/2025	angge	200
8/6/2025	angge	200
8/7/2025	angge	200
8/8/2025	angge	200
8/22/2025	angge	200
8/29/2025	angge	200
8/29/2025	ejay	250
8/30/2025	angge	200
8/30/2025	ejay	200
8/31/2025	ejay	100
8/31/2025	angge	200
9/1/2025	angge	200
9/2/2025	Chichay Sison	200
9/1/2025	ejay	200
9/2/2025	ejay	100
9/5/2025	ejay	400
9/5/2025	Lyle Castroverde	100
9/6/2025	Lyle Castroverde	100
9/8/2025	chichay sison	200
9/9/2025	angge	200
9/7/2025	ejay	100
9/9/2025	ejay	100
9/10/2025	ejay	100
9/11/2025	angge	200
9/11/2025	ejay	100
9/12/2025	angge	200
9/12/2025	ejay	100
9/13/2025	ejay	150
9/14/2025	ejay	150
9/15/2025	Chichay Sison	230
9/16/2025	angge	200
9/17/2025	ejay	150
9/19/2025	ejay	150
9/21/2025	Chichay Sison	200
9/20/2025	ejay	200
9/21/2025	ejay	200
9/22/2025	Chichay Sison	240
9/22/2025	ejay	200
9/23/2025	ejay	200
9/24/2025	ejay	400
9/25/2025	ejay	200
9/26/2025	ejay	200
9/27/2025	ejay	300
9/28/2025	ejay	200
9/29/2025	ejay	200
9/29/2025	Chichay Sison	200
10/1/2025	ejay	200
10/2/2025	ejay	200
10/3/2025	ejay	200
10/4/2025	ejay	300
10/6/2025	Chichay Sison	200
10/5/2025	ejay	200
10/6/2025	ejay	200
10/7/2025	ejay	200
10/10/2025	ejay	200
10/11/2025	ejay	300
10/16/2025	angge	200
10/19/2025	ejay	150
10/19/2025	angge	200
10/23/2025	ejay	200
10/24/2025	ejay	200
10/25/2025	ejay	300
10/26/2025	ejay	200
10/28/2025	ejay	200
10/28/2025	angge	200
10/29/2025	angge	200
10/29/2025	ejay	200
10/30/2025	angge	200
10/31/2025	angge	200
10/31/2025	ejay	200
11/3/2025	angge	200
11/4/2025	angge	200
11/5/2025	angge	200
11/8/2025	Chichay Sison	200
11/10/2025	Chichay Sison	200
11/13/2025	Chichay Sison	250
9/2/2025	Erica	300
9/3/2025	Erica	300
9/4/2025	Erica	150
9/5/2025	Erica	100
9/6/2025	Erica	100
9/7/2025	Erica	100
9/8/2025	Erica	100
9/9/2025	Erica	100
9/10/2025	Erica	100
9/11/2025	Erica	100
9/12/2025	Erica	100
9/18/2025	Erica	100
9/29/2025	Erica	100
10/3/2025	Erica	200
10/19/2025	Erica	100
10/22/2025	Erica	50
10/23/2025	Erica	100
10/24/2025	Erica	150
10/26/2025	Erica	100
10/27/2025	Erica	200
10/28/2025	Erica	200
10/29/2025	Erica	200
10/30/2025	Erica	200
10/31/2025	Erica	210
11/1/2025	Erica	150
11/2/2025	Erica	200
11/3/2025	Erica	200
11/4/2025	Erica	200
11/5/2025	Erica	200
11/6/2025	Erica	200
11/7/2025	Erica	200
11/8/2025	Erica	200
11/9/2025	Erica	200
11/10/2025	Erica	200
11/11/2025	Erica	200
11/12/2025	Erica	250
11/13/2025	Erica	250
11/18/2025	angge	200`;

function parseDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;
  const month = parts[0].padStart(2, '0');
  const day = parts[1].padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

// Generate UUIDs for historical entries
function generateId(): string {
  return 'hist-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
}

// Parse and create historical entries
export function getHistoricalEntries(): SuburiEntry[] {
  const lines = SEED_DATA.trim().split('\n');
  const entries: SuburiEntry[] = [];

  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 3) continue;

    const date = parseDate(parts[0]);
    const rawName = parts[1];
    const countStr = parts[2].replace(/,/g, '').replace(/\.00$/, '');
    const count = parseInt(countStr) || 0;

    if (count <= 0) continue;

    entries.push({
      id: generateId(),
      name: normalizeName(rawName),
      club: 'Unknown',
      count,
      date,
      metadata: {
        addedAt: new Date().toISOString(),
        location: { city: 'Manila', country: 'Philippines' },
      },
    });
  }

  return entries;
}
