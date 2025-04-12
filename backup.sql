--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    show_id integer,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    show_name character varying(255) NOT NULL,
    genre character varying(255),
    recommender_name character varying(255),
    reason text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_id_seq OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: show_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.show_genres (
    show_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.show_genres OWNER TO postgres;

--
-- Name: shows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shows (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    year character varying(50),
    type character varying(50) DEFAULT 'series'::character varying,
    poster character varying(5000),
    imdb_rating character varying(10),
    genre character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.shows OWNER TO postgres;

--
-- Name: shows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shows_id_seq OWNER TO postgres;

--
-- Name: shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shows_id_seq OWNED BY public.shows.id;


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: shows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows ALTER COLUMN id SET DEFAULT nextval('public.shows_id_seq'::regclass);


--
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
25076	2025-04-12 07:32:38.13244+05:30	Nikhil-lenovo
\.


--
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, show_id, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genres (id, name) FROM stdin;
1	Drama
2	Comedy
3	Action
4	Adventure
5	Sci-Fi
6	Fantasy
7	Horror
8	Thriller
9	Crime
10	Romance
11	Mystery
12	Documentary
13	Sitcom
14	Indian
15	Nikhil's Favorites
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, show_name, genre, recommender_name, reason, created_at) FROM stdin;
\.


--
-- Data for Name: show_genres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.show_genres (show_id, genre_id) FROM stdin;
\.


--
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shows (id, title, year, type, poster, imdb_rating, genre, created_at) FROM stdin;
40	The Bear	2022	series	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfxohwqSd6aeytMfvASiL0Hl7Q7keWP6vqqg&s	9.4	Drama, Nikhil's Favorites	2025-04-11 23:59:50.697233
48	Loki	2021	series	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRpMt0UmuLp1zIACE4kWDwNgoGX7BccYq6Wg&s	8.3	Adventure, Action, Fantasy	2025-04-12 00:09:50.842127
49	After Life	2019	series	https://m.media-amazon.com/images/M/MV5BNDVkNzU5ZjAtNjE5MC00YjBmLTk0NjAtYmFiOTk3MGIwZDlmXkEyXkFqcGc@._V1_.jpg	9	Comedy, Drama, Nikhil's Favorites, Romance	2025-04-12 00:11:14.07053
50	Sex Education	2019	series	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdHRB19ckC9CJvYxu5ZD8dH11ZSXoWawqO4A&s	8.4	Comedy, Drama, Sitcom	2025-04-12 00:12:09.557719
51	Suits	2011	series	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr4wC6FTryjH3C54TsciTF_F4xoulosDlyaYwm02vjGHlA7BToypQS7iPOceAopPfW2W4&usqp=CAU	8.6	Drama	2025-04-12 00:13:47.498519
52	Daredevil	2015	series	https://m.media-amazon.com/images/M/MV5BODcwOTg2MDE3NF5BMl5BanBnXkFtZTgwNTUyNTY1NjM@._V1_.jpg	8.4	Crime, Action, Drama, Fantasy	2025-04-12 00:20:53.390571
53	Game of Thrones	2011	series	https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.9	Action, Adventure, Drama, Fantasy	2025-04-12 00:23:31.42236
58	Special Ops	2020	series	https://m.media-amazon.com/images/M/MV5BN2E3OTI0OGItMWRhMi00NjU1LTk1ZTctMDEwOWZiMDczOWNlXkEyXkFqcGc@._V1_.jpg	8.7	Crime, Thriller, Drama, Adventure, Nikhil's Favorites, Indian	2025-04-12 00:33:29.193498
56	TVF Pitchers	2015	series	https://m.media-amazon.com/images/M/MV5BZDYxYTQxM2MtMDkxYi00ZjgzLTg0ODEtMWEzZjYzZTM5OGRiXkEyXkFqcGc@._V1_.jpg	8.5	Comedy, Drama, Indian	2025-04-12 00:28:46.788181
23	Breaking Bad	2008-2013	series	https://images.alphacoders.com/900/thumb-1920-900419.jpg	9	Crime, Drama, Thriller	2025-04-11 02:32:25.611357
26	Better Call Saul	2015	series	https://resizing.flixster.com/4kbpQ0rJSLQOVZc9jlVttSWYjBU=/fit-in/352x330/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10492751_b_v13_al.jpg	9.5	Drama , Crime , Nikhil's Favorites	2025-04-11 02:51:57.273153
27	The Sopranos	1999	series	https://static.hbo.com/2024-07/sporanos-max-banner-vanilla-2x3.jpg	9.4	Drama ,  Crime , Nikhil's Favorites	2025-04-11 18:57:56.452129
28	The Leftovers	2014	series	https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p10475256_b_v8_ac.jpg	9.3	Drama , Thriller , Sci-Fi , Mystery , Nikhil's Favorites\n	2025-04-11 19:03:14.251868
30	Mad Men	2007	series	https://m.media-amazon.com/images/M/MV5BYTNjNjc5OWQtYjMxNC00MzEwLWIxM2UtNjU3NzhkNjZmNGI3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.4	Drama	2025-04-11 19:11:25.709911
31	Sevrence	2022	series	https://m.media-amazon.com/images/I/713MTIICuTL._AC_UF894,1000_QL80_.jpg	9	Thriller , Sci-Fi , Mystery , Nikhil's Favorites	2025-04-11 19:16:12.227698
32	The Office	2005	series	https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	9	Comedy, Drama, Sitcom, Nikhil's Favorites	2025-04-11 20:07:05.677137
33	Brooklyn Nine-Nine(B99)	2013	series	https://res.cloudinary.com/dzdgpwtox/image/upload/w_600,c_scale,f_auto/v1693151221/designer-tool-uploads/bucket_3532/1693151216512.png	8.7	Comedy, Crime, Sitcom	2025-04-11 20:11:57.914166
35	The Big Bang Theory	2007	series	https://i.ebayimg.com/images/g/gVgAAOSwpuBZwsXf/s-l400.jpg	8.2	Comedy, Romance, Sitcom	2025-04-11 23:40:32.26121
36	Modern Family	2009	series	https://i.pinimg.com/736x/6e/da/e6/6edae6e676718fa92d5feefdd667d508.jpg	8.9	Comedy, Drama, Romance, Sitcom, Nikhil's Favorites	2025-04-11 23:41:43.65435
37	The Wire	2002	series	https://m.media-amazon.com/images/I/8157ug7+K+L.jpg	9	Crime, Drama, Thriller	2025-04-11 23:48:10.19824
38	How I Met Your Mother	2005	series	https://i.redd.it/vm7h0tqlf6y41.jpg	8.5	Comedy, Romance, Sitcom	2025-04-11 23:53:56.702787
39	Succession	2018	series	https://upload.wikimedia.org/wikipedia/en/6/64/Succession_season_4.jpg	9	Drama	2025-04-11 23:58:50.847465
41	Sherlock	2010	series	https://m.media-amazon.com/images/M/MV5BNTQzNGZjNDEtOTMwYi00MzFjLWE2ZTYtYzYxYzMwMjZkZDc5XkEyXkFqcGc@._V1_.jpg	9.2	Crime, Drama, Mystery, Thriller, Nikhil's Favorites	2025-04-12 00:01:36.115831
42	Fargo	2014	series	https://m.media-amazon.com/images/M/MV5BMjMzMTIzMTUwN15BMl5BanBnXkFtZTgwNjE0NTg0MTE@._V1_FMjpg_UX1000_.jpg	9	Crime, Thriller, Drama	2025-04-12 00:02:25.184105
43	The Boys	2019	series	https://m.media-amazon.com/images/M/MV5BMWJlN2U5MzItNjU4My00NTM2LWFjOWUtOWFiNjg3ZTMxZDY1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.8	Action, Crime, Drama	2025-04-12 00:04:03.539811
44	Seinfeld	1989	series	https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p183875_b_v8_ab.jpg	8.8	Comedy, Sitcom	2025-04-12 00:04:57.99838
45	Arrested Development	2003	series	https://m.media-amazon.com/images/M/MV5BOTk3N2M0MjktMDhkNi00ZGVhLTk4YTUtYjI5MDJmMWUzNTgwXkEyXkFqcGc@._V1_.jpg	8.5	Comedy, Sitcom	2025-04-12 00:05:39.716873
46	It's Always Sunny in Philadelphia	2005	series	https://upload.wikimedia.org/wikipedia/en/4/46/Sunny_in_Philadelphia_S7_DVD.jpg	9.5	Nikhil's Favorites, Comedy, Sitcom	2025-04-12 00:06:45.987429
47	New Girl	2007	series	https://m.media-amazon.com/images/M/MV5BMTQ5MzM1NzMwMl5BMl5BanBnXkFtZTgwNjQ2MzI2NzE@._V1_FMjpg_UX1000_.jpg	8.1	Comedy, Sitcom	2025-04-12 00:07:31.53503
54	House of the Dragon	2022	series	https://m.media-amazon.com/images/I/81E-5S4Cv5L._AC_UF1000,1000_QL80_DpWeblab_.jpg	8.8	Adventure, Action, Drama, Fantasy	2025-04-12 00:25:26.35082
55	Patal Lok	2020	series	https://upload.wikimedia.org/wikipedia/en/3/39/Paatal_Lok_poster.jpg	8.6	Crime, Mystery, Drama,Indian	2025-04-12 00:27:52.697642
57	Tripling	2016	series	https://m.media-amazon.com/images/S/pv-target-images/f09fd1cddb2210f823a6913589290810a69d5505ea31f78e50d7cdd3c46a7970.jpg	8.4	Comedy, Drama, Indian	2025-04-12 00:31:15.076383
63	Only Murders in the Building	2021	series	https://resizing.flixster.com/bV4zy6ZOyZdYrVEVgg4jQ8Z1M6Y=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vNzRmZDFlN2YtMjg4NS00NTQxLWI3NjEtODlhMTMyYjQ1ZWM2LmpwZw==	8.4	Adventure, Crime, Mystery, Thriller	2025-04-12 00:43:24.095419
60	The Family Man	2019	series	https://m.media-amazon.com/images/M/MV5BMDc3NWMwNGMtYjc3Mi00NzU5LWFiYjgtMTJjZGE3ZmFiNzRjXkEyXkFqcGc@._V1_.jpg	8.7	Action, Thriller, Indian, Crime	2025-04-12 00:37:05.42202
61	Mirzapur	2018	series	https://m.media-amazon.com/images/M/MV5BZTFjMzMxZTUtYTMyNy00OWNhLTk4ODQtNGI1NjI1NjJhMzc3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.5	Crime, Thriller, Indian	2025-04-12 00:38:01.327103
62	Sacred Games	2018	series	https://m.media-amazon.com/images/M/MV5BYjA4NzJlOGQtZmQzMy00Mjc0LWE2YzEtZjBlY2YyOGMwYmNkXkEyXkFqcGc@._V1_.jpg	8.7	Thriller, Indian, Mystery	2025-04-12 00:38:59.374055
59	College Romance	2018	series	https://images.justwatch.com/poster/92967086/s718/college-romance.jpg	8.3	Comedy, Drama, Romance, Indian	2025-04-12 00:35:07.311914
64	Pokemon (haha)	1997	series	https://m.media-amazon.com/images/M/MV5BMzE0ZDU1MzQtNTNlYS00YjNlLWE2ODktZmFmNDYzMTBlZTBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	10	Action, Adventure, Comedy, Drama, Fantasy, Nikhil's Favorites	2025-04-12 00:47:46.56142
65	Hostel Daze	2019	series	https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Hostel_Daze_Official_Poster.jpg/250px-Hostel_Daze_Official_Poster.jpg	8.5	Comedy, Sitcom, Indian	2025-04-12 00:51:19.807909
66	Reacher	2022	series	https://resizing.flixster.com/MUHg7BxYplXMYS4Pvk_oAqT8AfU=/fit-in/705x460/v2/https://resizing.flixster.com/aOqhVegqZxQJTttxL4KgyL17wzY=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvYTkxODEzZjMtYmQxNS00ZjIyLTkyOGQtNjJiMzc5ZWNkNzdiLmpwZw==	8.4	Action, Adventure, Crime, Drama	2025-04-12 00:52:11.299343
67	Fleabag	2016	series	https://resizing.flixster.com/IXWkCwJyyH0hL8Yqv0GqH2kKMRo=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p13139614_b_v10_ac.jpg	8.4	Comedy, Drama, Sitcom	2025-04-12 00:52:50.594539
69	Money Heist	2017	series	https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.7	Adventure, Crime, Thriller	2025-04-12 00:56:12.790465
70	13 Reasons Why	2017	series	https://dx35vtwkllhj9.cloudfront.net/netflix/evergreen-resource-site/images/hub/us/tout-13_reasons_why.jpg	7.9	Drama	2025-04-12 00:57:15.495604
71	eternally confused and eager for love	2022	series	https://m.media-amazon.com/images/M/MV5BNmVhYjgwMDYtZjE1Yi00YTBmLTg1YjctZmJhMWMxMTU3NmQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg	8.1	Comedy, Indian	2025-04-12 00:59:23.777265
72	Obliterated	2023	series	https://m.media-amazon.com/images/M/MV5BNDY5YTNmYTMtOTMxZS00ZTdhLTk5ZDktOTMxYjRmMGI3OTg1XkEyXkFqcGc@._V1_.jpg	7.8	Comedy, Action, Crime, Drama	2025-04-12 01:02:26.967053
68	Friends	1994	series	https://m.media-amazon.com/images/M/MV5BOTU2YmM5ZjctOGVlMC00YTczLTljM2MtYjhlNGI5YWMyZjFkXkEyXkFqcGc@._V1_.jpg	8.8	Drama, Sitcom, Romance, Nikhil's Favorites	2025-04-12 00:53:35.060974
\.


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 4, true);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genres_id_seq', 15, true);


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 7, true);


--
-- Name: shows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shows_id_seq', 72, true);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: show_genres show_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.show_genres
    ADD CONSTRAINT show_genres_pkey PRIMARY KEY (show_id, genre_id);


--
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);


--
-- Name: idx_recommendations_show_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_recommendations_show_name ON public.recommendations USING btree (show_name);


--
-- Name: idx_shows_title; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_shows_title ON public.shows USING btree (title);


--
-- Name: favorites favorites_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.shows(id) ON DELETE CASCADE;


--
-- Name: show_genres show_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.show_genres
    ADD CONSTRAINT show_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE CASCADE;


--
-- Name: show_genres show_genres_show_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.show_genres
    ADD CONSTRAINT show_genres_show_id_fkey FOREIGN KEY (show_id) REFERENCES public.shows(id) ON DELETE CASCADE;


--
-- Name: TABLE recommendations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recommendations TO show_user;


--
-- Name: SEQUENCE recommendations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.recommendations_id_seq TO show_user;


--
-- Name: TABLE shows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shows TO show_user;


--
-- Name: SEQUENCE shows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.shows_id_seq TO show_user;


--
-- PostgreSQL database dump complete
--

