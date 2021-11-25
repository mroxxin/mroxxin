import {Component, HostListener, OnInit} from '@angular/core';

declare var data : any;
declare var identity : any;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
	public navbarData = data['NavBar'];
	public identityData = identity;
	public activeClass: String = "Home";

	private offset :any = [];
	private offsetLink : any = [];

	private size : number = 0;
	private firstScroll : boolean = true;
	private firstClick : boolean = true;
	public navbarProfileVisibility : boolean= false;
	public navMenu : any;
	public sticky : any;
	constructor() {}

	ngOnInit(): void {
		for (const link of this.navbarData['links']) {
			this.offsetLink.push(link);
			this.offset.push(0);
		}
		this.size = this.navbarData['links'].length;
	}
	private binarySearch(target : number) : number{
		let low = 0;
		let high = this.offset.length - 1;

		if(target <= this.offset[low]){
			return 0;
		}
		if(target >= this.offset[high]){
			return high;
		}
		let res = 0;
		while(low<high)
		{
			let mid = Math.floor((low + high)/2);

			if(target < this.offset[mid]) {
				high = mid;
			} else {
				res = mid;
				low = mid + 1;
			}
		}
		return res;
	}

	@HostListener('window:scroll',['$event'])
	onWindowScroll(){
		if (this.firstScroll) {
			this.updateOffsetLink();
			this.firstScroll = false;
		}
		const scroll = scrollY + 10;
		if(!this.sticky){
			this.sticky = document.getElementById('sticky');
		}
		if (scroll + 50 >= window.innerHeight) {
			this.sticky.classList.add("nav-sticky");
		} else {
			this.sticky.classList.remove("nav-sticky");
		}
		let index: number = this.binarySearch(scroll);
		this.activeClass = this.offsetLink[index];
	}

	@HostListener('window:resize', ['$event'])
	onResize(){
		this.firstClick = true;
		this.firstScroll = true;
		if (!this.navMenu && document.getElementById('navbarCollapse')) {
			this.navMenu = document.getElementById('navbarCollapse');
		}
		if (window.innerWidth >= 992 && this.navbarProfileVisibility) {
			this.hideProfileVisibility();
		}
	}

	public scrollTo (target : any, duration = 1500, element : any = document.scrollingElement) {
		if (element.scrollTop === target) return;

		const cosParameter = (element.scrollTop - target) / 2;
		let scrollCount = 0;
		let oldTimestamp : any = null;

		const step = (newTimestamp : any)=>{
			if (oldTimestamp !== null) {
				scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration;
				if (scrollCount >= Math.PI) {
					element.scrollTop = target;
					return target;
				}else{
					element.scrollTop = cosParameter + target + cosParameter * Math.cos(scrollCount);
				}
			}
			oldTimestamp = newTimestamp;
			window.requestAnimationFrame(step);
		}
		window.requestAnimationFrame(step);
	}

	updateActiveLink(navLink : String) {
		if(this.firstClick){
			this.updateOffsetLink();
			this.firstClick = false;
		}
		this.activeClass = navLink;
		let t = 0;
		if(this.navbarProfileVisibility) {
			this.removeProfile();
			t = 900;
		}
		setTimeout(()=>{
			let element = document.getElementById(navLink.toLowerCase());
			if(element) {
				this.scrollTo(element.offsetTop);
			}
		},t);
	}

	public updateOffsetLink(){
		for (let index = 0;index < this.size;index++) {
			let element = document.getElementById(this.navbarData['links'][index].toLowerCase());
			if(element) {
				this.offset[index] = element.offsetTop;
			}
		}
	}

	public setProfileVisibility() {
		if (!this.navMenu && document.getElementById('navbarCollapse')) {
			this.navMenu = document.getElementById('navbarCollapse');
		}
		this.navMenu.classList.add('show');
		this.navbarProfileVisibility = true;
	}

	public hideProfileVisibility() {
		if (!this.navMenu && document.getElementById('navbarCollapse')) {
			this.navMenu = document.getElementById('navbarCollapse');
		}

		this.navMenu.classList.remove('show');
		this.navbarProfileVisibility = false;
	}

	public removeProfile() {
		if (!this.navMenu && document.getElementById('navbarCollapse')) {
			this.navMenu = document.getElementById('navbarCollapse');
		}
		this.navMenu.style.animation = 'slideOutRight 1s forwards';
		setTimeout(()=>{
			this.navMenu.style.animation = '';
			this.hideProfileVisibility();
		},1000);
	}

	public addProfile() {
		if (!this.navMenu && document.getElementById('navbarCollapse')) {
			this.navMenu = document.getElementById('navbarCollapse');
		}
		this.setProfileVisibility();
		this.navMenu.style.animation = 'slideInLeft 1s forwards';
		setTimeout(()=>{
			this.navMenu.style.animation = '';
		},1000);
	}
}
