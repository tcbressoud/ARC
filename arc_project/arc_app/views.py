from django.shortcuts import render
from django.contrib.auth.models import User
from arc_app.models import UserProfile, Contract
from arc_app.models import Session, ContractMeeting
from arc_app.serializers import UserSerializer, UserProfileSerializer, ContractSerializer
from arc_app.serializers import SessionSerializer, ContractMeetingSerializer
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from django.db.models import Q


class UserProfileViewSet(viewsets.ModelViewSet): 
    #This viewset automatically provides 'list', 'create', 'retrieve', 
    #'update', and 'destroy' actions
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    #Basic permission, allows  all permission if authenticated otherwise
    #user can only have 'read' operation
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self): 
    	user= self.request.user
    	if not user.is_authenticated:
    		return []

    	return UserProfile.objects.filter(user = user)

class UserViewSet(viewsets.ReadOnlyModelViewSet): 
    #This viewset automatically provide 'list' and 'detail' action
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]

	def get_queryset(self): 
		user= self.request.user
		if not user.is_authenticated:
			return []
		#get the params from url and filter it with 
		#the users objects
		first_name = self.request.query_params.get('first_name', None)
		last_name = self.request.query_params.get('last_name', None)
		email = self.request.query_params.get('email', None)
		users = self.queryset

		if first_name is not None: 
			users = users.filter(first_name=first_name)
		if last_name is not None: 
			users = users.filter(last_name=last_name)
		if email is not None: 
			users = users.filter(email=email)
			
		return users

class ContractViewSet(viewsets.ModelViewSet): 
    #This viewset automatically provides 'list', 'create', 'retrieve', 
    #'update', and 'destroy' actions 
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    #query contract based on the tutor of the contract and 
    #any parameter that is added onto the url 
    def get_queryset(self): 
    	user= self.request.user
    	if not user.is_authenticated:
    		return []

    	#get all the params from the url 
    	class_name = self.request.query_params.get('class_name', None)
    	subject = self.request.query_params.get('subject', None)
    	professor_name = self.request.query_params.get('professor_name', None)
    	tutor_name = self.request.query_params.get('tutor_name', None)

    	userprofile = user.userprofiles
    	contracts = self.queryset


    	#if the params is not Null, query it
    	if class_name is not None: 
    		contracts = contracts.filter(class_name = class_name)
    	if subject is not None: 
    		contracts = contracts.filter(subject = subject)
    	if professor_name is not None: 
    		contracts = contracts.filter(professor_name = professor_name)
    	if tutor_name is not None: 
    		contracts = contracts.filter(tutor_name = tutor_name)
    	    	
    	#query by location if possible 
    	location = self.request.query_params.get('location', None)
    	if location is not None: 
    		contracts = contracts.filter(location=location)
    	#query the contracts based on the user loging in
    	return contracts.filter(tutor = userprofile)

    @action(methods=['get'], detail=True)
    def get_sessions(self, request, pk=None): 
    	contract = self.get_object()
    	serializer = ContractSerializer(contract, many=False, context={'request':request})
    	sessions = serializer.data['sessions']
    	sessions_all = Session.objects.all()

    	query = Q(id = sessions[0]['id'])
    	for i in range (1, len(sessions)): 
    		session_id = sessions[i]['id']
    		query.add(Q(id=session_id), Q.OR)

    	contract_sessions = sessions_all.filter(query)
    	contract_sessions_serializer = SessionSerializer(contract_sessions, many=True , context={'request':request})

    	return Response(contract_sessions_serializer.data)

    @action(methods=['get'], detail=True)
    def get_contractmeetings(self, request, pk=None): 
    	contract = self.get_object()
    	serializer = ContractSerializer(contract, many=False, context={'request':request})
    	cmeetings = serializer.data['contract_meetings']
    	cmeetings_all = ContractMeeting.objects.all()

    	query = Q(id = cmeetings[0]['id'])
    	for i in range (1, len(cmeetings)): 
    		session_id = cmeetings[i]['id']
    		query.add(Q(id=session_id), Q.OR)

    	contract_cmeetings = cmeetings_all.filter(query)
    	contract_cmeetings_serializer = ContractMeetingSerializer(contract_cmeetings, many=True , context={'request':request})

    	return Response(contract_cmeetings_serializer.data)

class ContractMeetingViewSet(viewsets.ModelViewSet): 
    queryset = ContractMeeting.objects.all()
    serializer_class = ContractMeetingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self): 
    	user = self.request.user
    	if not user.is_authenticated:
    		return []

    	#get all contracts that contract meetings is belong to
    	#based on user that is currently log in
    	userprofile = user.userprofiles
    	contracts = Contract.objects.filter(tutor = userprofile)
    	
    	#create a query variable that allow us to query all the 
    	#contract meeting of that user
    	query = Q(contract= contracts[0])
    	for i in range(1,len(contracts)): 
    		query.add(Q(contact = contracts[i]), Q.OR)

    	contract_meetings = self.queryset
    	return contract_meetings.filter(query)


class SessionViewSet(viewsets.ModelViewSet): 
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
    	user = self.request.user
    	if not user.is_authenticated:
    		return []

    	#get all contracts that sessions is belong to
    	#based on user that is currently log in
    	userprofile = self.request.user.userprofiles
    	contracts = Contract.objects.filter(tutor = userprofile)

    	#create a query variable that allow us to query all the 
    	#sessions of that user
    	query = Q(contract= contracts[0])
    	for i in range(1,len(contracts)): 
    		query.add(Q(contact = contracts[i]), Q.OR)

    	sessions = self.queryset
    	return sessions.filter(query)
